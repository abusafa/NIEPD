import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
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

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category
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
      color,
      parentId 
    } = body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current category)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: { 
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prevent setting parent as self or child
    if (parentId && parentId === params.id) {
      return NextResponse.json(
        { error: 'Category cannot be parent of itself' },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        slug,
        type,
        color,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        children: true,
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

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: true,
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

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has children
    if (category.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 400 }
      );
    }

    // Check if category is being used
    const totalUsage = category._count.news + category._count.programs + category._count.events + category._count.pages;
    if (totalUsage > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It is being used by ${totalUsage} items.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
