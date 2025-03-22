import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const timeline = await prisma.timelineEvent.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json(timeline);
      }

      case 'POST': {
        const { year, event, category, order, image } = req.body;

        const created = await prisma.timelineEvent.create({
          data: { year, event, category, order, image },
        });

        return res.status(201).json(created);
      }

      case 'PUT': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        const { year, event, category, order, image } = req.body;

        const updated = await prisma.timelineEvent.update({
          where: { id },
          data: { year, event, category, order, image },
        });

        return res.status(200).json(updated);
      }

      case 'DELETE': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        await prisma.timelineEvent.delete({
          where: { id },
        });

        return res.status(204).end();
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Timeline API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
