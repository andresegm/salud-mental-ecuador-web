import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const sections = await prisma.aboutSection.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json(sections);
      }

      case 'POST': {
        const { title, content, order, slug } = req.body;

        if (!title || !content || !slug) {
          return res.status(400).json({ error: 'Title, content, and slug are required' });
        }

        const newSection = await prisma.aboutSection.create({
          data: { title, content, order: order ?? 0, slug },
        });

        return res.status(201).json(newSection);
      }

      case 'PUT': {
        const { title, content, order } = req.body;
      
        const updated = await prisma.aboutSection.update({
          where: { id: req.query.id as string },
          data: {
            ...(title && { title }),
            ...(content && { content }),
            ...(order && { order }),
          },
        });
      
        return res.status(200).json(updated);
      }
      

      case 'DELETE': {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        await prisma.aboutSection.delete({ where: { id } });
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error('API error in /about:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
