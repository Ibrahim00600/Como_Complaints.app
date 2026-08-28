import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const scanUrl = `${protocol}://${host}/`;

    const qrBuffer = await QRCode.toBuffer(scanUrl, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#002B49',
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
