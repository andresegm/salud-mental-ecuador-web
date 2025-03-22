import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    console.log('Missing token or secret');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    console.log('Decoded token:', payload);

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      console.log('Not an admin');
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
