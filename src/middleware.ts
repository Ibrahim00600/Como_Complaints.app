import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('cucs_auth_token')?.value;

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    // Verify the token is valid
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_minimum_32_chars_long');
      await jwtVerify(token, secret);
    } catch {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (req.nextUrl.pathname.startsWith('/login') && token) {
    const adminUrl = new URL('/admin', req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
