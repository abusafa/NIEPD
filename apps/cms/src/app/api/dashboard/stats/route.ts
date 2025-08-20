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

    // Get current date for time-based calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get counts for different content types with enhanced analytics
    const [
      newsStats,
      programsStats, 
      eventsStats,
      usersStats,
      recentNews,
      recentPrograms,
      recentEvents,
      upcomingEvents,
      recentContacts,
      contentGrowth,
      mediaStats,
      categoryStats,
      monthlyStats
    ] = await Promise.all([
      // News statistics
      prisma.news.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      
      // Programs statistics
      prisma.program.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      
      // Events statistics  
      prisma.event.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      
      // Users statistics
      prisma.user.groupBy({
        by: ['isActive'],
        _count: { isActive: true },
      }),
      
      // Recent news
      prisma.news.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          status: true,
          updatedAt: true,
          featured: true,
          author: {
            select: {
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      // Recent programs
      prisma.program.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          status: true,
          participants: true,
          rating: true,
          updatedAt: true,
          featured: true,
        },
      }),
      
      // Recent events
      prisma.event.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          status: true,
          startDate: true,
          endDate: true,
          eventStatus: true,
          updatedAt: true,
          featured: true,
        },
      }),

      // Upcoming events
      prisma.event.findMany({
        where: {
          startDate: { gte: now },
          status: 'PUBLISHED',
        },
        take: 5,
        orderBy: { startDate: 'asc' },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          startDate: true,
          endDate: true,
          locationEn: true,
          locationAr: true,
        },
      }),

      // Recent contact messages
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),

      // Content growth in last 30 days
      prisma.$transaction([
        prisma.news.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.program.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.event.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.contactMessage.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]),

      // Media statistics
      prisma.media.aggregate({
        _count: true,
        _sum: { size: true },
      }),

      // Category statistics
      prisma.category.groupBy({
        by: ['type'],
        _count: { type: true },
      }),

      // Monthly content creation statistics (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          'news' as type,
          COUNT(*) as count
        FROM "news"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        UNION ALL
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          'program' as type,
          COUNT(*) as count
        FROM "programs"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        UNION ALL
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          'event' as type,
          COUNT(*) as count
        FROM "events"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC, type
      `
    ]);

    // Calculate upcoming events count
    const upcomingEventsCount = upcomingEvents.length;

    // Process statistics with enhanced analytics
    const stats = {
      news: {
        total: newsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: newsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: newsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: newsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
        growth30d: contentGrowth[0] || 0,
      },
      programs: {
        total: programsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: programsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: programsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: programsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
        totalParticipants: recentPrograms.reduce((sum, program) => sum + (program.participants || 0), 0),
        growth30d: contentGrowth[1] || 0,
      },
      events: {
        total: eventsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: eventsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: eventsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: eventsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
        upcoming: upcomingEventsCount,
        growth30d: contentGrowth[2] || 0,
      },
      users: {
        total: usersStats.reduce((sum, stat) => sum + stat._count.isActive, 0),
        active: usersStats.find(s => s.isActive === true)?._count.isActive || 0,
      },
      contacts: {
        total: recentContacts.length,
        unread: recentContacts.filter(c => c.status === 'UNREAD').length,
        growth30d: contentGrowth[3] || 0,
      },
      media: {
        total: mediaStats._count || 0,
        totalSize: mediaStats._sum.size || 0,
        averageSize: mediaStats._count ? (mediaStats._sum.size || 0) / mediaStats._count : 0,
      },
      categories: categoryStats.reduce((acc, cat) => {
        acc[cat.type.toLowerCase()] = cat._count.type;
        return acc;
      }, {} as Record<string, number>),
    };

    const recentActivity = [
      ...recentNews.map(item => ({
        id: item.id,
        title: item.titleEn,
        titleAr: item.titleAr,
        type: 'news' as const,
        status: item.status,
        updatedAt: item.updatedAt,
        featured: item.featured,
        author: item.author?.firstName && item.author?.lastName 
          ? `${item.author.firstName} ${item.author.lastName}`
          : item.author?.username || 'Unknown',
      })),
      ...recentPrograms.map(item => ({
        id: item.id,
        title: item.titleEn,
        titleAr: item.titleAr,
        type: 'program' as const,
        status: item.status,
        updatedAt: item.updatedAt,
        participants: item.participants,
        rating: item.rating,
        featured: item.featured,
      })),
      ...recentEvents.map(item => ({
        id: item.id,
        title: item.titleEn,
        titleAr: item.titleAr,
        type: 'event' as const,
        status: item.status,
        updatedAt: item.updatedAt,
        startDate: item.startDate,
        endDate: item.endDate,
        eventStatus: item.eventStatus,
        featured: item.featured,
      })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10);

    // Format upcoming events
    const formattedUpcomingEvents = upcomingEvents.map(event => ({
      id: event.id,
      titleEn: event.titleEn,
      titleAr: event.titleAr,
      startDate: event.startDate,
      endDate: event.endDate,
      locationEn: event.locationEn,
      locationAr: event.locationAr,
    }));

    // Format contact messages
    const formattedContacts = recentContacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      subject: contact.subject,
      status: contact.status,
      createdAt: contact.createdAt,
    }));

    // Format monthly stats for charts
    const formattedMonthlyStats = (monthlyStats as { month: Date; type: string; count: string }[]).reduce((acc, stat) => {
      const monthKey = new Date(stat.month).toISOString().substring(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, news: 0, program: 0, event: 0 };
      }
      acc[monthKey][stat.type as 'news' | 'program' | 'event'] = parseInt(stat.count);
      return acc;
    }, {} as Record<string, { month: string; news: number; program: number; event: number }>);

    return NextResponse.json({
      stats,
      recentActivity,
      upcomingEvents: formattedUpcomingEvents,
      recentContacts: formattedContacts,
      monthlyStats: Object.values(formattedMonthlyStats),
      analytics: {
        contentGrowth30d: {
          news: contentGrowth[0] || 0,
          programs: contentGrowth[1] || 0,
          events: contentGrowth[2] || 0,
          contacts: contentGrowth[3] || 0,
        },
        totalParticipants: recentPrograms.reduce((sum, program) => sum + (program.participants || 0), 0),
        avgProgramRating: recentPrograms.length > 0 
          ? recentPrograms.reduce((sum, program) => sum + (program.rating || 0), 0) / recentPrograms.length 
          : 0,
        mediaStorage: {
          totalFiles: mediaStats._count || 0,
          totalSizeBytes: mediaStats._sum.size || 0,
          totalSizeMB: ((mediaStats._sum.size || 0) / (1024 * 1024)).toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
