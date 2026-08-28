import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { hashPassword } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { email, password, role } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: role || 'STAFF' },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
