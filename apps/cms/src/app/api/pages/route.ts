import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const language = searchParams.get('language') || '';
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (language) {
      where.language = language;
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
          parent: {
            select: {
              id: true,
              titleAr: true,
              titleEn: true,
            },
          },
          children: {
            select: {
              id: true,
              titleAr: true,
              titleEn: true,
            },
          },
        },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      pages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      titleAr, 
      titleEn, 
      contentAr, 
      contentEn, 
      slug,
      metaTitleAr,
      metaTitleEn,
      metaDescriptionAr,
      metaDescriptionEn,
      template,
      language,
      parentId,
      status,
      sortOrder
    } = body;

    // Validate required fields
    if (!titleAr || !titleEn || !contentAr || !contentEn) {
      return NextResponse.json(
        { error: 'Title and content in both languages are required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    if (slug) {
      const existingPage = await prisma.page.findUnique({
        where: { slug },
      });

      if (existingPage) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    const page = await prisma.page.create({
      data: {
        titleAr,
        titleEn,
        contentAr,
        contentEn,
        slug,
        metaTitleAr,
        metaTitleEn,
        metaDescriptionAr,
        metaDescriptionEn,
        template: template || 'page',
        language: language || 'BOTH',
        parentId,
        status: status || 'DRAFT',
        sortOrder: sortOrder || 0,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, username: true },
        },
        parent: {
          select: { id: true, titleAr: true, titleEn: true },
        },
        children: {
          select: { id: true, titleAr: true, titleEn: true },
        },
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
