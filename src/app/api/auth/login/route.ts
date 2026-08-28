import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';
import { scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await (async () => {
      try {
        const [salt, storedHash] = user.passwordHash.split(':');
        const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
        const storedHashBuffer = Buffer.from(storedHash, 'hex');
        if (hashBuffer.length !== storedHashBuffer.length) return false;
        return timingSafeEqual(hashBuffer, storedHashBuffer);
      } catch {
        return false;
      }
    })();

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_minimum_32_chars_long');
    const token = await new SignJWT({ userId: user.id, role: user.role, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({ success: true }, { status: 200 });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'cucs_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Check if it's a Prisma connection error
    if (error.message?.includes('Authentication failed') || error.message?.includes('Can\'t reach database') || error.message?.includes('DATABASE_URL')) {
      return NextResponse.json({ error: 'Database connection failed. Ensure DATABASE_URL is set in Vercel Environment Variables.' }, { status: 500 });
    }

    return NextResponse.json({ error: 'Internal server error: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
