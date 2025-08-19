import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

// GET /api/tags/[id] - Get single tag
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            news: true,
            programs: true,
            events: true,
            pages: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id] - Update tag
export async function PUT(
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
      descriptionAr, 
      descriptionEn, 
      slug, 
      type, 
      color 
    } = body;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current tag)
    if (slug && slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findFirst({
        where: { 
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        slug,
        type,
        color,
      },
      include: {
        _count: {
          select: {
            news: true,
            programs: true,
            events: true,
            pages: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete tag
export async function DELETE(
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            news: true,
            programs: true,
            events: true,
            pages: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if tag is being used
    const totalUsage = tag._count.news + tag._count.programs + tag._count.events + tag._count.pages;
    if (totalUsage > 0) {
      return NextResponse.json(
        { error: `Cannot delete tag. It is being used by ${totalUsage} items.` },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Tag deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
