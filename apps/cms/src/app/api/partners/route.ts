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

// GET /api/partners - List all partners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const featured = searchParams.get('featured');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { organizationAr: { contains: search, mode: 'insensitive' } },
        { organizationEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json({
      data: partners,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/partners - Create new partner
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
      organizationAr, 
      organizationEn, 
      descriptionAr,
      descriptionEn,
      logo,
      website,
      email,
      phone,
      type,
      featured,
      sortOrder
    } = body;

    // Validate required fields
    if (!nameAr || !nameEn || !organizationAr || !organizationEn) {
      return NextResponse.json(
        { error: 'Name and organization in both languages are required' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        nameAr,
        nameEn,
        organizationAr,
        organizationEn,
        descriptionAr,
        descriptionEn,
        logo,
        website,
        email,
        phone,
        type: type || 'PARTNER',
        featured: featured || false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
