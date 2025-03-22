import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=0')
  res.status(200).json({ success: true })
}
