import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

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

// GET /api/contact-info - Get all contact information
export async function GET(request: NextRequest) {
  try {
    const contactInfo = await prisma.contactInfo.findMany({
      orderBy: { type: 'asc' }
    });

    return NextResponse.json({ data: contactInfo }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/contact-info - Create new contact info
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

    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      type,
      labelAr, 
      labelEn, 
      valueAr,
      valueEn,
      icon,
      link,
      sortOrder,
      isPublic
    } = body;

    // Validate required fields
    if (!type || !labelAr || !labelEn) {
      return NextResponse.json(
        { error: 'Type and labels in both languages are required' },
        { status: 400 }
      );
    }

    const contactInfo = await prisma.contactInfo.create({
      data: {
        type,
        labelAr,
        labelEn,
        valueAr,
        valueEn,
        icon,
        link,
        sortOrder: sortOrder || 0,
        isPublic: isPublic !== false,
      },
    });

    return NextResponse.json(contactInfo, { status: 201 });
  } catch (error) {
    console.error('Error creating contact info:', error);
    return NextResponse.json({ error: 'Failed to create contact info' }, { status: 500 });
  }
}

// PUT /api/contact-info - Update multiple contact info items
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { contactInfoItems } = body;

    if (!Array.isArray(contactInfoItems)) {
      return NextResponse.json({ error: 'contactInfoItems must be an array' }, { status: 400 });
    }

    // Update each contact info item
    const updates = contactInfoItems.map(item => {
      if (item.id) {
        // Update existing
        return prisma.contactInfo.update({
          where: { id: item.id },
          data: {
            labelAr: item.labelAr,
            labelEn: item.labelEn,
            valueAr: item.valueAr,
            valueEn: item.valueEn,
            icon: item.icon,
            link: item.link,
            sortOrder: item.sortOrder,
            isPublic: item.isPublic,
          },
        });
      } else {
        // Create new
        return prisma.contactInfo.create({
          data: {
            type: item.type,
            labelAr: item.labelAr,
            labelEn: item.labelEn,
            valueAr: item.valueAr,
            valueEn: item.valueEn,
            icon: item.icon,
            link: item.link,
            sortOrder: item.sortOrder || 0,
            isPublic: item.isPublic !== false,
          },
        });
      }
    });

    const updatedContactInfo = await Promise.all(updates);

    return NextResponse.json({ 
      message: 'Contact info updated successfully',
      contactInfo: updatedContactInfo 
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}
