import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { email, currentPassword, newPassword } = await req.json();
    const updateData: Record<string, string> = {};

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== auth.userId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
      updateData.email = email;
    }

    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: auth.userId } });
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });

      updateData.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes to save' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (e) {
    console.error('Profile update error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
