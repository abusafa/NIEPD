import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/programs/[id] - Get a single program
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                nameAr: true,
                nameEn: true,
              }
            }
          }
        }
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

// PUT /api/programs/[id] - Update a program
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      slug,
      duration,
      durationType,
      level,
      image,
      prerequisites,
      rating,
      participants,
      featured,
      isFree,
      isCertified,
      status,
      categoryId,
      tagIds,
    } = body;

    // Handle categoryId - convert empty string to null
    const validCategoryId = categoryId && categoryId !== '' ? categoryId : null;

    // First, delete existing tag relationships
    await prisma.programTag.deleteMany({
      where: { programId: id }
    });

    const program = await prisma.program.update({
      where: { id },
      data: {
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        slug,
        duration: parseInt(duration),
        durationType,
        level,
        image,
        rating: rating ? parseFloat(rating) : null,
        participants: participants ? parseInt(participants) : null,
        prerequisites: Array.isArray(prerequisites) 
          ? prerequisites.join('\n') 
          : (prerequisites || null),
        featured: Boolean(featured),
        isFree: Boolean(isFree),
        isCertified: Boolean(isCertified),
        status,
        categoryId: validCategoryId,
        tags: tagIds ? {
          create: tagIds.map((tagId: string) => ({
            tagId,
          }))
        } : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                nameAr: true,
                nameEn: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE /api/programs/[id] - Delete a program
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete tag relationships first
    await prisma.programTag.deleteMany({
      where: { programId: id }
    });

    // Then delete the program
    await prisma.program.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}
