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

    // Get counts for different content types
    const [
      newsStats,
      programsStats, 
      eventsStats,
      usersStats,
      recentNews,
      recentPrograms,
      recentEvents
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
          updatedAt: true,
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
          updatedAt: true,
        },
      }),
    ]);

    // Process statistics
    const stats = {
      news: {
        total: newsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: newsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: newsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: newsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
      },
      programs: {
        total: programsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: programsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: programsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: programsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
      },
      events: {
        total: eventsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        published: eventsStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
        draft: eventsStats.find(s => s.status === 'DRAFT')?._count.status || 0,
        review: eventsStats.find(s => s.status === 'REVIEW')?._count.status || 0,
        upcoming: 0, // We'll calculate this separately if needed
      },
      users: {
        total: usersStats.reduce((sum, stat) => sum + stat._count.isActive, 0),
        active: usersStats.find(s => s.isActive === true)?._count.isActive || 0,
      },
    };

    const recentActivity = [
      ...recentNews.map(item => ({
        id: item.id,
        title: item.titleEn,
        titleAr: item.titleAr,
        type: 'news' as const,
        status: item.status,
        updatedAt: item.updatedAt,
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
      })),
      ...recentEvents.map(item => ({
        id: item.id,
        title: item.titleEn,
        titleAr: item.titleAr,
        type: 'event' as const,
        status: item.status,
        updatedAt: item.updatedAt,
        startDate: item.startDate,
      })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10);

    return NextResponse.json({
      stats,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
