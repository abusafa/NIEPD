import { NextRequest, NextResponse } from 'next/server';

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
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/news - List all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
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
              tag: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news: news.map(item => ({
        ...item,
        tags: item.tags.map(nt => nt.tag),
      })),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/news - Create new news
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tagIds, ...newsData } = body;

    const news = await prisma.news.create({
      data: {
        ...newsData,
        authorId: user.id,
        publishedAt: newsData.status === 'PUBLISHED' ? new Date() : null,
        tags: tagIds?.length ? {
          create: tagIds.map((tagId: string) => ({ tagId }))
        } : undefined,
      },
      include: {
        category: true,
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
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...news,
      tags: news.tags.map(nt => nt.tag),
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
