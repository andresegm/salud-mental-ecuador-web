import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const timeline = await prisma.timelineEvent.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json(timeline);
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
