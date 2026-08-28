import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const userCount = await prisma.user.count();
    
    // Only allow setup if no users exist
    if (userCount > 0) {
      return NextResponse.json({ error: 'Setup already complete' }, { status: 403 });
    }

    const passwordHash = await bcrypt.hash('Admin@123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@cosmopolitan.edu',
        passwordHash,
        role: 'SUPER_ADMIN',
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Initial admin created successfully',
      credentials: {
        email: 'admin@cosmopolitan.edu',
        password: 'Admin@123'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
