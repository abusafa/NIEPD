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

// GET /api/public/news/[id] - Get single news item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findFirst({
      where: {
        id: params.id,
        status: 'PUBLISHED',
      },
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
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Transform data for public consumption
    const transformedNews = {
      id: news.id,
      titleAr: news.titleAr,
      titleEn: news.titleEn,
      summaryAr: news.summaryAr,
      summaryEn: news.summaryEn,
      contentAr: news.contentAr,
      contentEn: news.contentEn,
      slug: news.slug,
      image: news.image,
      featured: news.featured,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      category: news.category,
      author: news.author,
      tags: news.tags.map(nt => nt.tag),
    };

    return NextResponse.json(transformedNews, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public news item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news item' },
      { status: 500, headers: corsHeaders }
    );
  }
}
