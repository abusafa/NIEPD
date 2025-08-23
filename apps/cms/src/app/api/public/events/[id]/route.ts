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

// GET /api/public/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        status: 'PUBLISHED',
      },
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
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Transform data for public consumption
    const transformedEvent = {
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
    };

    return NextResponse.json(transformedEvent, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500, headers: corsHeaders }
    );
  }
}
