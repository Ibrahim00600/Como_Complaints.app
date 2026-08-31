import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const locationId = formData.get('locationId') as string;
    const type = formData.get('type') as any;
    const description = formData.get('description') as string;
    const reporterName = formData.get('reporterName') as string;
    const reporterEmail = formData.get('reporterEmail') as string;
    const image = formData.get('image') as File | null;

    if (!locationId || !type || !description || !reporterName || !reporterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (image) {
      // Convert File to base64 for Cloudinary upload
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = `data:${image.type};base64,${buffer.toString('base64')}`;

      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: 'cucs_complaints',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const complaint = await prisma.complaint.create({
      data: {
        locationId,
        type,
        description,
        reporterName,
        reporterEmail,
        imageUrl,
        priority: 'MEDIUM', // Default
        status: 'PENDING',
      },
      include: {
        location: true,
      }
    });

    // Send Email Notification asynchronously
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"CUCS System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to the admin/staff email
        subject: `New Complaint Reported: ${complaint.type} at ${complaint.location.name}`,
        html: `
          <h3>New Complaint Details</h3>
          <p><strong>Location:</strong> ${complaint.location.name}</p>
          <p><strong>Type:</strong> ${complaint.type}</p>
          <p><strong>Description:</strong> ${complaint.description}</p>
          ${imageUrl ? `<p><a href="${imageUrl}">View Attached Image</a></p>` : ''}
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/complaints/${complaint.id}">View in Dashboard</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (error) {
    console.error('Failed to create complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
