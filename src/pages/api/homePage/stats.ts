import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const stats = await prisma.stat.findMany({
          orderBy: { label: 'asc' },
        });
        return res.status(200).json(stats);
      }

      case 'POST': {
        const { label, value, unit } = req.body;

        if (!label || typeof value !== 'number') {
          return res.status(400).json({ error: 'Label and numeric value are required.' });
        }

        const newStat = await prisma.stat.create({
          data: { label, value, unit },
        });

        return res.status(201).json(newStat);
      }

      case 'PUT': {
        const { id } = req.query;
        const { label, value, unit } = req.body;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        const updated = await prisma.stat.update({
          where: { id },
          data: { label, value, unit },
        });

        return res.status(200).json(updated);
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        await prisma.stat.delete({ where: { id } });
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error('API error in /stats:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
