import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyAuth(req: NextRequest) {
  try {
    const token = req.cookies.get('cucs_auth_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_minimum_32_chars_long');
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}
