import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

// POST /api/news/[id]/review - Submit news for review
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    // Authors can submit their own content for review
    // Editors and above can submit any content for review
    if (user.role === 'AUTHOR' && news.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only submit your own content for review' },
        { status: 403 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: {
        status: 'REVIEW',
      },
    });

    return NextResponse.json({
      message: 'News submitted for review successfully',
      news: updatedNews,
    });
  } catch (error) {
    console.error('Error submitting news for review:', error);
    return NextResponse.json(
      { error: 'Failed to submit news for review' },
      { status: 500 }
    );
  }
}
