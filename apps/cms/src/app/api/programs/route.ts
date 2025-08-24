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

// GET /api/programs - List all programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const level = searchParams.get('level') || '';
    const featured = searchParams.get('featured');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (level) {
      where.level = level;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        include: {
          category: {
            select: {
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
                  nameAr: true,
                  nameEn: true,
                }
              }
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    return NextResponse.json({
      data: programs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/programs - Create a new program
export async function POST(request: NextRequest) {
  try {
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

    const program = await prisma.program.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        slug,
        duration: parseInt(duration),
        durationType: durationType || 'HOURS',
        level: level || 'BEGINNER',
        image,
        rating: rating ? parseFloat(rating) : null,
        participants: participants ? parseInt(participants) : null,
        prerequisites: Array.isArray(prerequisites) 
          ? prerequisites.join('\n') 
          : (prerequisites || null),
        featured: Boolean(featured),
        isFree: Boolean(isFree),
        isCertified: Boolean(isCertified),
        status: status || 'DRAFT',
        categoryId,
        authorId: user.id,
        tags: tagIds ? {
          create: tagIds.map((tagId: string) => ({
            tagId,
          }))
        } : undefined,
      },
      include: {
        category: {
          select: {
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
                nameAr: true,
                nameEn: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
