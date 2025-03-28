import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const services = await prisma.service.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json(services);
      }

      case 'POST': {
        const { title, description, section, price, buttonLabel, buttonUrl, order } = req.body;

        if (!title || !description) {
          return res.status(400).json({ error: 'Title and description are required.' });
        }

        const newService = await prisma.service.create({
          data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(section && { section }),
            ...(price && { price }),
            ...(buttonLabel && { buttonLabel }),
            ...(buttonUrl && { buttonUrl }),
            ...(typeof order === 'number' && { order }),
            ...(typeof req.body.featured === 'boolean' && { featured: req.body.featured }),
          },          
        });

        return res.status(201).json(newService);
      }

      case 'PUT': {
        const { id } = req.query;
        const { title, description, section, price, buttonLabel, buttonUrl, order, featured } = req.body;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        const updatedService = await prisma.service.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(section && { section }),
            ...(price && { price }),
            ...(buttonLabel && { buttonLabel }),
            ...(buttonUrl && { buttonUrl }),
            ...(typeof order === 'number' && { order }),
            ...(typeof featured === 'boolean' && { featured }),
          },
        });

        return res.status(200).json(updatedService);
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        await prisma.service.delete({
          where: { id },
        });

        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Service API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
