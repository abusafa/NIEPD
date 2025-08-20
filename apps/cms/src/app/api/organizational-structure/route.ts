import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}

// GET /api/organizational-structure - Get all organizational structure members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { isActive: true };
    
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search } },
        { positionEn: { contains: search, mode: 'insensitive' } },
        { positionAr: { contains: search } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.organizationalStructure.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { nameEn: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.organizationalStructure.count({ where }),
    ]);

    return NextResponse.json({
      data: members,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching organizational structure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizational structure' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/organizational-structure - Create new member
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validation
    if (!body.nameAr?.trim() || !body.nameEn?.trim()) {
      return NextResponse.json(
        { error: 'Name is required in both languages' },
        { status: 400 }
      );
    }

    if (!body.positionAr?.trim() || !body.positionEn?.trim()) {
      return NextResponse.json(
        { error: 'Position is required in both languages' },
        { status: 400 }
      );
    }

    const member = await prisma.organizationalStructure.create({
      data: {
        nameAr: body.nameAr.trim(),
        nameEn: body.nameEn.trim(),
        positionAr: body.positionAr.trim(),
        positionEn: body.positionEn.trim(),
        descriptionAr: body.descriptionAr?.trim() || '',
        descriptionEn: body.descriptionEn?.trim() || '',
        image: body.image || '',
        parentId: body.parentId || null,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating organizational structure member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
