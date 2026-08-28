import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ qrId: string }> }
) {
  try {
    const { qrId } = await params;

    // Construct the URL that the QR code should point to when scanned
    const scanUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/scan/${qrId}`;

    // Generate QR code as a buffer (PNG image)
    const qrBuffer = await QRCode.toBuffer(scanUrl, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#002B49', // University Brand Color
        light: '#FFFFFF'
      }
    });

    return new NextResponse(new Uint8Array(qrBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
