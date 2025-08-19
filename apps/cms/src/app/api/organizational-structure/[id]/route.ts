import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  } catch {
    return null;
  }
}

// GET /api/organizational-structure/[id] - Get specific member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const member = await prisma.organizationalStructure.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

// PUT /api/organizational-structure/[id] - Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if member exists
    const existingMember = await prisma.organizationalStructure.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Validation
    if (!body.nameAr?.trim() || !body.nameEn?.trim()) {
      return NextResponse.json(
        { error: 'Name is required in both languages' },
        { status: 400 }
      );
    }

    if (!body.titleAr?.trim() || !body.titleEn?.trim()) {
      return NextResponse.json(
        { error: 'Title is required in both languages' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const updatedMember = await prisma.organizationalStructure.update({
      where: { id },
      data: {
        nameAr: body.nameAr.trim(),
        nameEn: body.nameEn.trim(),
        titleAr: body.titleAr.trim(),
        titleEn: body.titleEn.trim(),
        roleAr: body.roleAr?.trim() || existingMember.roleAr,
        roleEn: body.roleEn?.trim() || existingMember.roleEn,
        bioAr: body.bioAr?.trim() ?? existingMember.bioAr,
        bioEn: body.bioEn?.trim() ?? existingMember.bioEn,
        photo: body.photo ?? existingMember.photo,
        email: body.email?.trim() ?? existingMember.email,
        phone: body.phone?.trim() ?? existingMember.phone,
        department: body.department ?? existingMember.department,
        isExecutive: body.isExecutive ?? existingMember.isExecutive,
        sortOrder: body.sortOrder ?? existingMember.sortOrder,
        isActive: body.isActive ?? existingMember.isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizational-structure/[id] - Delete member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.organizationalStructure.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    await prisma.organizationalStructure.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
