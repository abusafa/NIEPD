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

// GET /api/public/programs - Public programs endpoint for website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const level = searchParams.get('level') || null;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause - only published programs
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (featured) {
      where.featured = true;
    }

    if (level) {
      where.level = level;
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
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
          partner: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              logo: true,
              website: true,
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
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    // Transform data for public consumption
    const transformedPrograms = programs.map(program => ({
      id: program.id,
      titleAr: program.titleAr,
      titleEn: program.titleEn,
      descriptionAr: program.descriptionAr,
      descriptionEn: program.descriptionEn,
      slug: program.slug,
      duration: program.duration,
      durationType: program.durationType,
      level: program.level,
      instructorAr: program.instructorAr,
      instructorEn: program.instructorEn,
      rating: program.rating,
      participants: program.participants,
      image: program.image,
      partnerAr: program.partnerAr,
      partnerEn: program.partnerEn,
      featuresAr: program.featuresAr,
      featuresEn: program.featuresEn,
      targetAudienceAr: program.targetAudienceAr,
      targetAudienceEn: program.targetAudienceEn,
      prerequisitesAr: program.prerequisitesAr,
      prerequisitesEn: program.prerequisitesEn,
      certification: program.certification,
      featured: program.featured,
      isFree: program.isFree,
      isCertified: program.isCertified,
      launchDate: program.launchDate,
      publishedAt: program.publishedAt,
      createdAt: program.createdAt,
      category: program.category,
      author: program.author,
      tags: program.tags.map(pt => pt.tag),
    }));

    return NextResponse.json({
      data: transformedPrograms,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500, headers: corsHeaders }
    );
  }
}
