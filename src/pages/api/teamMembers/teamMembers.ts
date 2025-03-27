import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, TeamCategory } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const members = await prisma.teamMember.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json(members);
      }

      case 'POST': {
        const { name, role, category, image, bio, order } = req.body;

        if (!name || !role || !category || typeof order !== 'number') {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const created = await prisma.teamMember.create({
          data: {
            name,
            role,
            category: category as TeamCategory,
            image,
            bio,
            order,
          },
        });

        return res.status(201).json(created);
      }

      case 'PUT': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        const { name, role, category, image, bio, order } = req.body;

        const updated = await prisma.teamMember.update({
          where: { id },
          data: {
            name,
            role,
            category: category as TeamCategory,
            image,
            bio,
            order,
          },
        });

        return res.status(200).json(updated);
      }

      case 'DELETE': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        await prisma.teamMember.delete({ where: { id } });
        return res.status(204).end();
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('TeamMember API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
