import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET /api/public/faq - Public FAQ endpoint for website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause - only published FAQs
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
      }),
      prisma.fAQ.count({ where }),
    ]);

    // Transform data for public consumption
    const transformedFAQs = faqs.map(faq => ({
      id: faq.id,
      questionAr: faq.questionAr,
      questionEn: faq.questionEn,
      answerAr: faq.answerAr,
      answerEn: faq.answerEn,
      sortOrder: faq.sortOrder,
      category: faq.category,
      publishedAt: faq.publishedAt,
      createdAt: faq.createdAt,
    }));

    return NextResponse.json({
      data: transformedFAQs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500, headers: corsHeaders }
    );
  }
}
