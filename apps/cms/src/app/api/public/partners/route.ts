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

// GET /api/public/partners - Public partners endpoint for website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const type = searchParams.get('type') || null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause - only published partners
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (featured) {
      where.featured = true;
    }

    if (type) {
      where.type = type;
    }

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          organizationAr: true,
          organizationEn: true,
          descriptionAr: true,
          descriptionEn: true,
          slug: true,
          logo: true,
          website: true,
          type: true,
          featured: true,
          sortOrder: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json({
      data: partners,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500, headers: corsHeaders }
    );
  }
}
