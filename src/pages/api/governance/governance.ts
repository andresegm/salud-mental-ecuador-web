import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const docs = await prisma.governanceDocument.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json(docs);
      }

      case 'POST': {
        const { title, url, year, version, description, order } = req.body;
        if (!title || !url || !year) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const created = await prisma.governanceDocument.create({
          data: { title, url, year, version, description, order },
        });

        return res.status(201).json(created);
      }

      case 'PUT': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        const { title, url, year, version, description, order } = req.body;

        const updated = await prisma.governanceDocument.update({
          where: { id },
          data: { title, url, year, version, description, order },
        });

        return res.status(200).json(updated);
      }

      case 'DELETE': {
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid id' });
        }

        await prisma.governanceDocument.delete({
          where: { id },
        });

        return res.status(204).end();
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Governance API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
