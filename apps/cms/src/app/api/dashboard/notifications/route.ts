import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get recent activity that would generate notifications
    const [
      recentContactMessages,
      recentPublishedContent,
      upcomingEvents,
      systemUpdates
    ] = await Promise.all([
      // Unread contact messages
      prisma.contactMessage.findMany({
        where: { status: 'UNREAD' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          subject: true,
          message: true,
          createdAt: true,
          status: true,
        },
      }),

      // Recently published content
      prisma.news.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          publishedAt: true,
          author: {
            select: {
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),

      // Upcoming events (within 24 hours)
      prisma.event.findMany({
        where: {
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
          },
          status: 'PUBLISHED',
        },
        take: 3,
        orderBy: { startDate: 'asc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          startDate: true,
          locationEn: true,
          locationAr: true,
        },
      }),

      // System updates (mock for now - you can implement actual system notifications)
      Promise.resolve([
        {
          id: 'system-1',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2:00 AM',
          timestamp: new Date(),
          category: 'system',
          type: 'info' as const,
        }
      ])
    ]);

    // Build notifications array
    const notifications: Array<{
      id: string;
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
      category: 'message' | 'content' | 'system';
      timestamp: Date;
      read: boolean;
      actionUrl?: string;
      actionLabel?: string;
    }> = [];

    // Contact message notifications
    recentContactMessages.forEach(message => {
      notifications.push({
        id: `contact-${message.id}`,
        type: 'info' as const,
        title: 'New Contact Message',
        message: `${message.name} sent: "${message.subject}"`,
        category: 'message' as const,
        timestamp: message.createdAt,
        read: false,
        actionUrl: '/admin/contact-messages',
        actionLabel: 'View Message',
      });
    });

    // Content publication notifications
    recentPublishedContent.forEach(content => {
      const authorName = content.author?.firstName && content.author?.lastName
        ? `${content.author.firstName} ${content.author.lastName}`
        : content.author?.username || 'Unknown';

      notifications.push({
        id: `news-${content.id}`,
        type: 'success' as const,
        title: 'Content Published',
        message: `Article "${content.titleEn}" has been published by ${authorName}`,
        category: 'content' as const,
        timestamp: content.publishedAt || new Date(),
        read: false,
        actionUrl: `/admin/news/${content.id}`,
        actionLabel: 'View Article',
      });
    });

    // Upcoming event notifications
    upcomingEvents.forEach(event => {
      const hoursUntil = Math.ceil(
        (new Date(event.startDate).getTime() - Date.now()) / (1000 * 60 * 60)
      );

      notifications.push({
        id: `event-${event.id}`,
        type: 'warning' as const,
        title: 'Event Starting Soon',
        message: `"${event.titleEn}" starts in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`,
        category: 'content' as const,
        timestamp: event.startDate,
        read: false,
        actionUrl: `/admin/events/${event.id}`,
        actionLabel: 'View Event',
      });
    });

    // System notifications
    systemUpdates.forEach(update => {
      notifications.push({
        id: update.id,
        type: update.type,
        title: update.title,
        message: update.message,
        category: update.category as 'message' | 'content' | 'system',
        timestamp: update.timestamp,
        read: true, // System notifications are typically pre-read
      });
    });

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      notifications: notifications.slice(0, 10), // Limit to 10 most recent
      unreadCount: notifications.filter(n => !n.read).length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
