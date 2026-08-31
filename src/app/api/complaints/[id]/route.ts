import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
      include: { location: true },
    });

    // If status is changed to RESOLVED and reporter provided an email, notify them
    if (status === 'RESOLVED' && complaint.reporterEmail) {
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
          from: `"CUCS Facility Management" <${process.env.EMAIL_USER}>`,
          to: complaint.reporterEmail,
          subject: `Your Complaint has been Resolved! (CUCS)`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #002B49;">Complaint Resolved</h2>
              <p>Hello ${complaint.reporterName || 'there'},</p>
              <p>We are writing to let you know that the issue you reported has been successfully <strong>resolved</strong> by our facility management team.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #374151;">Details of your report:</h4>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${complaint.location.name}</p>
                <p style="margin: 5px 0;"><strong>Issue Type:</strong> ${complaint.type}</p>
                <p style="margin: 5px 0;"><strong>Description:</strong> ${complaint.description}</p>
              </div>

              <p>Thank you for helping us keep Cosmopolitan University in excellent condition!</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br/>The CUCS Facility Management Team</p>
            </div>
          `,
        });
        console.log(`Resolution email sent to ${complaint.reporterEmail}`);
      } catch (emailError) {
        console.error('Failed to send resolution email:', emailError);
      }
    }

    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    console.error('Failed to update complaint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
