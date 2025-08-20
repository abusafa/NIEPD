import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';



// GET /api/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          }
        },
        children: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          },
          orderBy: { sortOrder: 'asc' }
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update page
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const params = await context.params;
    const { id } = params;
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
      status,
      template,
      language,
      sortOrder,
      parentId
    } = body;

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current page)
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findFirst({
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

    // Prevent setting parent as self or child
    if (parentId && parentId === id) {
      return NextResponse.json(
        { error: 'Page cannot be parent of itself' },
        { status: 400 }
      );
    }

    const updatedPage = await prisma.page.update({
      where: { id },
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
        status: status || 'DRAFT',
        template: template || 'page',
        language: language || 'BOTH',
        sortOrder: sortOrder || 0,
        parentId: parentId || null,
        updatedAt: new Date(),
      },
      include: {
        parent: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          }
        },
        children: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          },
          orderBy: { sortOrder: 'asc' }
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const params = await context.params;
    const { id } = params;
    
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
      include: {
        children: {
          select: { id: true }
        }
      }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if page has children - prevent deletion if it does
    if (existingPage.children && existingPage.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete page that has sub-pages. Please delete or move the sub-pages first.' },
        { status: 400 }
      );
    }

    // Delete the page
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Page deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}