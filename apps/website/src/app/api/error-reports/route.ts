import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for error report from website
const errorReportSchema = z.object({
  titleAr: z.string().min(1, 'Arabic title is required').max(200, 'Title is too long'),
  titleEn: z.string().min(1, 'English title is required').max(200, 'Title is too long'),
  descriptionAr: z.string().min(10, 'Arabic description must be at least 10 characters').max(2000, 'Description is too long'),
  descriptionEn: z.string().min(10, 'English description must be at least 10 characters').max(2000, 'Description is too long'),
  userEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  userName: z.string().max(100, 'Name is too long').optional(),
  userPhone: z.string().max(20, 'Phone is too long').optional(),
  pageUrl: z.string().url('Invalid URL'),
  userAgent: z.string().optional(),
  browserInfo: z.object({
    browser: z.string().optional(),
    version: z.string().optional(),
    os: z.string().optional(),
    screenResolution: z.string().optional(),
    viewport: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
  errorStack: z.string().optional(),
  errorType: z.enum(['USER_REPORTED', 'JAVASCRIPT_ERROR', 'API_ERROR', 'UI_BUG']).default('USER_REPORTED'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const result = errorReportSchema.safeParse(body);
    
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

    const data = result.data;

    // Get client IP and user agent if not provided
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = data.userAgent || request.headers.get('user-agent') || 'unknown';

    // Prepare data for CMS
    const errorReportData = {
      ...data,
      userEmail: data.userEmail || null,
      userName: data.userName || null,
      userPhone: data.userPhone || null,
      userAgent,
      ipAddress,
      browserInfo: data.browserInfo || undefined,
      errorStack: data.errorStack || null,
    };

    // Save to CMS database via API
    const cmsApiUrl = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';
    
    try {
      const cmsResponse = await fetch(`${cmsApiUrl}/api/error-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReportData),
      });

      if (!cmsResponse.ok) {
        console.error('Failed to save error report to CMS:', await cmsResponse.text());
        // Continue anyway - don't fail the user request
        
        return NextResponse.json(
          { 
            error: 'Failed to submit error report',
            message: 'حدث خطأ في إرسال التقرير، يرجى المحاولة مرة أخرى لاحقاً.'
          },
          { status: 500 }
        );
      } else {
        console.log('Error report saved to CMS successfully');
        const cmsData = await cmsResponse.json();
        
        return NextResponse.json(
          { 
            message: 'تم إرسال تقرير الخطأ بنجاح، شكراً لك على مساعدتنا في تحسين الموقع',
            success: true,
            reportId: cmsData.data?.id
          },
          { status: 201 }
        );
      }
    } catch (cmsError) {
      console.error('Error saving to CMS:', cmsError);
      // Continue anyway - don't fail the user request
      
      return NextResponse.json(
        { 
          error: 'Failed to submit error report',
          message: 'حدث خطأ في إرسال التقرير، يرجى المحاولة مرة أخرى لاحقاً.'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error report submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'حدث خطأ داخلي، يرجى المحاولة مرة أخرى لاحقاً.' 
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
