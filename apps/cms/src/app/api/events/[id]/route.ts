import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/events/[id] - Get a single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
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

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
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

    // Handle categoryId - convert empty string to null
    const validCategoryId = categoryId && categoryId !== '' ? categoryId : null;

    // First, delete existing tag relationships
    await prisma.eventTag.deleteMany({
      where: { eventId: id }
    });

    const event = await prisma.event.update({
      where: { id },
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
        eventStatus,
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

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete tag relationships first
    await prisma.eventTag.deleteMany({
      where: { eventId: id }
    });

    // Then delete the event
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
