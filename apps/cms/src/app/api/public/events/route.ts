import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET /api/public/events - Public events endpoint for website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const eventStatus = searchParams.get('eventStatus') || null;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause - only published events
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (featured) {
      where.featured = true;
    }

    if (eventStatus) {
      where.eventStatus = eventStatus;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  nameAr: true,
                  nameEn: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { startDate: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    // Transform data for public consumption
    const transformedEvents = events.map(event => ({
      id: event.id,
      titleAr: event.titleAr,
      titleEn: event.titleEn,
      summaryAr: event.summaryAr,
      summaryEn: event.summaryEn,
      descriptionAr: event.descriptionAr,
      descriptionEn: event.descriptionEn,
      slug: event.slug,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      locationAr: event.locationAr,
      locationEn: event.locationEn,
      venueAr: event.venueAr,
      venueEn: event.venueEn,
      registrationUrl: event.registrationUrl,
      capacity: event.capacity,
      registrationDeadline: event.registrationDeadline,
      eventTypeAr: event.eventTypeAr,
      eventTypeEn: event.eventTypeEn,
      image: event.image,
      featured: event.featured,
      eventStatus: event.eventStatus,
      publishedAt: event.publishedAt,
      createdAt: event.createdAt,
      category: event.category,
      author: event.author,
      tags: event.tags.map(et => et.tag),
    }));

    return NextResponse.json({
      data: transformedEvents,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500, headers: corsHeaders }
    );
  }
}
