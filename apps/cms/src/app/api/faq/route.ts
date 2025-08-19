import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  } catch {
    return null;
  }
}

// GET /api/faq - Get all FAQ items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (category) {
      where.categorySlug = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search) {
      where.OR = [
        { questionEn: { contains: search, mode: 'insensitive' } },
        { questionAr: { contains: search } },
        { answerEn: { contains: search, mode: 'insensitive' } },
        { answerAr: { contains: search } },
      ];
    }

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fAQ.count({ where }),
    ]);

    return NextResponse.json({
      data: faqs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/faq - Create new FAQ item
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validation
    if (!body.questionAr?.trim() || !body.questionEn?.trim()) {
      return NextResponse.json(
        { error: 'Question is required in both languages' },
        { status: 400 }
      );
    }

    if (!body.answerAr?.trim() || !body.answerEn?.trim()) {
      return NextResponse.json(
        { error: 'Answer is required in both languages' },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        categorySlug: body.categorySlug || 'general',
        questionAr: body.questionAr.trim(),
        questionEn: body.questionEn.trim(),
        answerAr: body.answerAr.trim(),
        answerEn: body.answerEn.trim(),
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
        featured: body.featured || false,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
