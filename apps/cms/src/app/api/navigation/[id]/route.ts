import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/navigation/[id] - Get single navigation item
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { id } = params;
    const navigationItem = await prisma.navigation.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        },
        parent: {
          select: {
            id: true,
            labelAr: true,
            labelEn: true,
          }
        }
      },
    });

    if (!navigationItem) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(navigationItem);
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation item' },
      { status: 500 }
    );
  }
}

// PUT /api/navigation/[id] - Update navigation item
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
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { 
      labelAr, 
      labelEn, 
      url, 
      parentId, 
      sortOrder, 
      isActive, 
      target
    } = body;

    // Check if navigation item exists
    const existingItem = await prisma.navigation.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!labelAr || !labelEn) {
      return NextResponse.json(
        { error: 'Label in both languages is required' },
        { status: 400 }
      );
    }

    // Prevent setting parent as self or child
    if (parentId && parentId === id) {
      return NextResponse.json(
        { error: 'Navigation item cannot be parent of itself' },
        { status: 400 }
      );
    }

    // Check for circular dependency (if setting a parent)
    if (parentId) {
      const potentialParent = await prisma.navigation.findUnique({
        where: { id: parentId },
      });

      if (!potentialParent) {
        return NextResponse.json(
          { error: 'Parent navigation item not found' },
          { status: 400 }
        );
      }

      // Check if the potential parent is actually a child of the current item
      const isCircularDependency = async (currentId: string, targetParentId: string): Promise<boolean> => {
        const children = await prisma.navigation.findMany({
          where: { parentId: currentId },
          select: { id: true }
        });

        for (const child of children) {
          if (child.id === targetParentId) {
            return true;
          }
          if (await isCircularDependency(child.id, targetParentId)) {
            return true;
          }
        }
        return false;
      };

      if (await isCircularDependency(id, parentId)) {
        return NextResponse.json(
          { error: 'Cannot create circular dependency in navigation hierarchy' },
          { status: 400 }
        );
      }
    }

    const updatedItem = await prisma.navigation.update({
      where: { id },
      data: {
        labelAr,
        labelEn,
        url: url || '#',
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== false,
        target: target || '_self',
      },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        },
        parent: {
          select: { id: true, labelAr: true, labelEn: true }
        }
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

// DELETE /api/navigation/[id] - Delete navigation item
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

    const { id } = await context.params;
    
    // Check if navigation item exists
    const existingItem = await prisma.navigation.findUnique({
      where: { id },
      include: {
        children: {
          select: { id: true }
        }
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Check if item has children - prevent deletion if it does
    if (existingItem.children && existingItem.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete navigation item that has sub-items. Please delete or move the sub-items first.' },
        { status: 400 }
      );
    }

    // Delete the navigation item
    await prisma.navigation.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Navigation item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}
