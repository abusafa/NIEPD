import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

// POST /api/news/[id]/unpublish - Unpublish news (move to draft)
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to unpublish content' },
        { status: 403 }
      );
    }

    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        status: 'DRAFT',
        // Keep publishedAt for history
      },
    });

    return NextResponse.json({
      message: 'News unpublished successfully',
      news: updatedNews,
    });
  } catch (error) {
    console.error('Error unpublishing news:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish news' },
      { status: 500 }
    );
  }
}
