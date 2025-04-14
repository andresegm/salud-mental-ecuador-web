import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const posts = await prisma.blogPost.findMany({
          orderBy: { publishedAt: 'desc' },
          include: { likedBy: true },
        });
        return res.status(200).json(posts);
      }

      case 'POST': {
        const { title, slug, content, author, category, coverImage, publishedAt, status } = req.body;

        if (!title || !slug || !content || !publishedAt || !status) {
          return res.status(400).json({ error: 'Missing required fields.' });
        }

        const newPost = await prisma.blogPost.create({
          data: {
            title,
            slug,
            content,
            author,
            category,
            coverImage,
            publishedAt: new Date(publishedAt),
            status,
          },
        });

        return res.status(201).json(newPost);
      }

      case 'PUT': {
        const { id } = req.query;
        const { title, slug, content, author, category, coverImage, publishedAt, status } = req.body;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        const updatedPost = await prisma.blogPost.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(slug && { slug }),
            ...(content && { content }),
            ...(author && { author }),
            ...(category && { category }),
            ...(coverImage && { coverImage }),
            ...(publishedAt && { publishedAt: new Date(publishedAt) }),
            ...(status && { status }),
          },
        });

        return res.status(200).json(updatedPost);
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        await prisma.blogPost.delete({ where: { id } });
        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('BlogPost API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
