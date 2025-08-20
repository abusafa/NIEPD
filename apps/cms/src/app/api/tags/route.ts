import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || ''; // news, programs, events, etc.
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              news: true,
              programs: true,
              events: true,
            },
          },
        },
      }),
      prisma.tag.count({ where }),
    ]);

    return NextResponse.json({
      tags,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create new tag
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      nameAr, 
      nameEn, 
      slug
    } = body;

    // Validate required fields
    if (!nameAr || !nameEn) {
      return NextResponse.json(
        { error: 'Tag name in both languages is required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    if (slug) {
      const existingTag = await prisma.tag.findUnique({
        where: { slug },
      });

      if (existingTag) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const tag = await prisma.tag.create({
      data: {
        nameAr,
        nameEn,
        slug,
      },
      include: {
        _count: {
          select: {
            news: true,
            programs: true,
            events: true,
          },
        },
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
