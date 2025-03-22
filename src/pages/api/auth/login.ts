import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  const secret = process.env.JWT_SECRET
  const expiration = process.env.JWT_EXPIRATION

  if (!secret || !expiration) {
    throw new Error("JWT_SECRET and JWT_EXPIRATION must be set")
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  // Here's the explicit type-casting solution:
  const signOptions = {
    expiresIn: expiration,
  } as SignOptions;

  const token = jwt.sign(payload, secret, signOptions)

  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
  )
  res.status(200).json({ success: true })
}
