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

// GET /api/public/programs/[id] - Get single program
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const program = await prisma.program.findFirst({
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
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Transform data for public consumption
    const transformedProgram = {
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
      partner: program.partner,
      tags: program.tags.map(pt => pt.tag),
    };

    return NextResponse.json(transformedProgram, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500, headers: corsHeaders }
    );
  }
}
