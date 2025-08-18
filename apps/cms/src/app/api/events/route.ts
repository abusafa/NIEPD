import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/events - List all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const eventStatus = searchParams.get('eventStatus') || '';
    const featured = searchParams.get('featured');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { summaryAr: { contains: search, mode: 'insensitive' } },
        { summaryEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (eventStatus) {
      where.eventStatus = eventStatus;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          category: {
            select: {
              nameAr: true,
              nameEn: true,
              color: true,
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
          { startDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
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
      summaryAr,
      summaryEn,
      descriptionAr,
      descriptionEn,
      slug,
      startDate,
      endDate,
      startTime,
      endTime,
      locationAr,
      locationEn,
      venueAr,
      venueEn,
      registrationUrl,
      capacity,
      registrationDeadline,
      eventTypeAr,
      eventTypeEn,
      image,
      featured,
      eventStatus,
      status,
      categoryId,
      tagIds,
    } = body;

    const event = await prisma.event.create({
      data: {
        titleAr,
        titleEn,
        summaryAr,
        summaryEn,
        descriptionAr,
        descriptionEn,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        locationAr,
        locationEn,
        venueAr,
        venueEn,
        registrationUrl,
        capacity: capacity ? parseInt(capacity) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        eventTypeAr,
        eventTypeEn,
        image,
        featured: Boolean(featured),
        eventStatus: eventStatus || 'UPCOMING',
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
            color: true,
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

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
