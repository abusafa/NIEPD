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

// GET /api/public/news - Public news endpoint for website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause - only published news
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (featured) {
      where.featured = true;
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
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
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  nameAr: true,
                  nameEn: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    // Transform data for public consumption
    const transformedNews = news.map(item => ({
      id: item.id,
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      summaryAr: item.summaryAr,
      summaryEn: item.summaryEn,
      contentAr: item.contentAr,
      contentEn: item.contentEn,
      slug: item.slug,
      image: item.image,
      featured: item.featured,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      category: item.category,
      author: item.author,
      tags: item.tags.map(nt => nt.tag),
    }));

    return NextResponse.json({
      data: transformedNews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500, headers: corsHeaders }
    );
  }
}
