import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, type, parentId } = await req.json();
    
    if (!name || !type) {
      return NextResponse.json({ error: 'Missing name or type' }, { status: 400 });
    }

    // Dynamic import to use standard crypto or fallback since this is server-side Next.js
    const qrCodeUrl = crypto.randomUUID();

    const location = await prisma.location.create({
      data: {
        name,
        type,
        parentId: parentId ? String(parentId) : undefined,
        qrCodeUrl,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Failed to create location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
