import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/navigation - List all navigation items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || '';

    // Build where clause
    const where: Record<string, unknown> = {};
    if (location) {
      where.location = location;
    }

    const navigation = await prisma.navigation.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ],
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
      }
    });

    return NextResponse.json({ navigation });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

// POST /api/navigation - Create new navigation item
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

    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      labelAr, 
      labelEn, 
      url, 
      location, 
      parentId, 
      sortOrder, 
      isActive, 
      openInNewWindow,
      icon
    } = body;

    // Validate required fields
    if (!labelAr || !labelEn) {
      return NextResponse.json(
        { error: 'Label in both languages is required' },
        { status: 400 }
      );
    }

    const navigationItem = await prisma.navigation.create({
      data: {
        labelAr,
        labelEn,
        url: url || '#',
        location: location || 'header',
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== false,
        openInNewWindow: openInNewWindow || false,
        icon,
      },
      include: {
        children: true,
        parent: {
          select: { id: true, labelAr: true, labelEn: true }
        }
      },
    });

    return NextResponse.json(navigationItem, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation:', error);
    return NextResponse.json({ error: 'Failed to create navigation' }, { status: 500 });
  }
}
