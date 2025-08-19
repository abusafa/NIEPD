import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: result.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Here you would typically:
    // 1. Save the message to your database
    // 2. Send an email notification to admins
    // 3. Send a confirmation email to the user
    // 4. Integrate with your CRM/support system

    // Save to CMS database via API
    const cmsApiUrl = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';
    
    try {
      const cmsResponse = await fetch(`${cmsApiUrl}/api/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      if (!cmsResponse.ok) {
        console.error('Failed to save message to CMS:', await cmsResponse.text());
        // Continue anyway - don't fail the user request
      } else {
        console.log('Contact message saved to CMS successfully');
      }
    } catch (error) {
      console.error('Error saving to CMS:', error);
      // Continue anyway - don't fail the user request
    }

    // Log for debugging
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you might want to:
    // - Send email using a service like SendGrid, AWS SES, or Nodemailer
    // - Save to database using Prisma, MongoDB, or your preferred ORM
    // - Send to CMS system for admin review
    
    // Example email sending (commented out - requires email service setup):
    /*
    try {
      await sendEmail({
        to: 'admin@niepd.edu.sa',
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `
      });
      
      // Send confirmation email to user
      await sendEmail({
        to: email,
        subject: 'شكراً لتواصلكم معنا - Thank you for contacting us',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>شكراً لتواصلكم معنا</h2>
            <p>عزيزي/عزيزتي ${name}،</p>
            <p>شكراً لكم على تواصلكم معنا. لقد تلقينا رسالتكم وسنقوم بالرد عليكم في أقرب وقت ممكن.</p>
            <hr>
            <h2>Thank you for contacting us</h2>
            <p>Dear ${name},</p>
            <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }
    */

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to submit contact form. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
