import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  let userId: string;
  try {
    const decoded = verifyToken(token);
    userId = (decoded as any).userId;
    if (!userId) throw new Error('ID de usuario faltante');
  } catch (err) {
    console.error('Error verificando token:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }

  const { postId } = req.body;
  if (!postId) return res.status(400).json({ error: 'Falta el postId' });

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: { likedBy: true },
    });

    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    const alreadyLiked = post.likedBy.some(user => user.id === userId);

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        likedBy: alreadyLiked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
      include: { likedBy: true },
    });
    res.status(200).json(updated); 
    res.status(200).json({ likedBy: updated.likedBy });
  } catch (err) {
    console.error('Error actualizando likes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
