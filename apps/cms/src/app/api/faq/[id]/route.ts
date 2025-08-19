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

// GET /api/faq/[id] - Get specific FAQ item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ' },
      { status: 500 }
    );
  }
}

// PUT /api/faq/[id] - Update FAQ item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Validation
    if (!body.questionAr?.trim() || !body.questionEn?.trim()) {
      return NextResponse.json(
        { error: 'Question is required in both languages' },
        { status: 400 }
      );
    }

    if (!body.answerAr?.trim() || !body.answerEn?.trim()) {
      return NextResponse.json(
        { error: 'Answer is required in both languages' },
        { status: 400 }
      );
    }

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        categorySlug: body.categorySlug || existingFaq.categorySlug,
        questionAr: body.questionAr.trim(),
        questionEn: body.questionEn.trim(),
        answerAr: body.answerAr.trim(),
        answerEn: body.answerEn.trim(),
        sortOrder: body.sortOrder ?? existingFaq.sortOrder,
        isActive: body.isActive ?? existingFaq.isActive,
        featured: body.featured ?? existingFaq.featured,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedFaq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/[id] - Delete FAQ item
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

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
