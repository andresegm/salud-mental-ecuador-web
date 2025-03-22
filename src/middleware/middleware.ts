import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const secret = process.env.JWT_SECRET
  if (!token || !secret) return NextResponse.redirect(new URL('/login', req.url))

  try {
    const decoded = jwt.verify(token, secret) as { role: string }
    if (decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
