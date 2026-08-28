import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
