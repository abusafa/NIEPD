import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for error report
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

const updateErrorReportSchema = z.object({
  status: z.enum(['NEW', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedToId: z.string().optional().nullable(),
  resolutionNotesAr: z.string().optional(),
  resolutionNotesEn: z.string().optional(),
});

// GET /api/error-reports - List all error reports with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    console.log('🐛 Error Reports API: Starting request...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const errorType = searchParams.get('errorType');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    console.log('🐛 Query params:', { page, limit, status, severity, errorType, assignedTo, search, sortBy, sortOrder });

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (status) {
      where.status = status;
    }
    
    if (severity) {
      where.severity = severity;
    }
    
    if (errorType) {
      where.errorType = errorType;
    }
    
    if (assignedTo) {
      where.assignedToId = assignedTo;
    }
    
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { pageUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log('🐛 Querying database with where clause:', where);
    
    const [errorReports, total] = await Promise.all([
      prisma.errorReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assignedTo: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
      }),
      prisma.errorReport.count({ where }),
    ]);

    console.log('🐛 Database query results:', { reportsCount: errorReports.length, total });

    const totalPages = Math.ceil(total / limit);

    // Get statistics for dashboard
    const stats = await prisma.errorReport.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count._all;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      data: errorReports,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: {
        total,
        new: statusCounts['NEW'] || 0,
        investigating: statusCounts['INVESTIGATING'] || 0,
        inProgress: statusCounts['IN_PROGRESS'] || 0,
        resolved: statusCounts['RESOLVED'] || 0,
        closed: statusCounts['CLOSED'] || 0,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching error reports:', error);
    console.error('❌ Error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return NextResponse.json(
      { error: 'Failed to fetch error reports', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/error-reports - Create a new error report (for user submissions)
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

    const errorReport = await prisma.errorReport.create({
      data: {
        ...data,
        userEmail: data.userEmail || null,
        userName: data.userName || null,
        userPhone: data.userPhone || null,
        userAgent,
        ipAddress,
        browserInfo: data.browserInfo || undefined,
        errorStack: data.errorStack || null,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    console.log('🐛 New error report created:', errorReport.id);

    return NextResponse.json({
      success: true,
      data: errorReport,
      message: 'Error report saved successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating error report:', error);
    return NextResponse.json(
      { error: 'Failed to save error report', details: (error as Error).message },
      { status: 500 }
    );
  }
}
