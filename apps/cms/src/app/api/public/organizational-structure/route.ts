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

// GET /api/public/organizational-structure - Public org structure endpoint for website
export async function GET(request: NextRequest) {
  try {
    const orgStructure = await prisma.organizationalStructure.findMany({
      where: {
        isActive: true,
      },
      include: {
        children: {
          where: {
            isActive: true,
          },
          orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' }
          ],
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    // Filter to only root level items (no parent)
    const rootItems = orgStructure.filter(item => !item.parentId);

    // Transform data for public consumption
    const transformedStructure = rootItems.map(item => ({
      id: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      positionAr: item.positionAr,
      positionEn: item.positionEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      image: item.image,
      sortOrder: item.sortOrder,
      children: item.children.map(child => ({
        id: child.id,
        nameAr: child.nameAr,
        nameEn: child.nameEn,
        positionAr: child.positionAr,
        positionEn: child.positionEn,
        descriptionAr: child.descriptionAr,
        descriptionEn: child.descriptionEn,
        image: child.image,
        sortOrder: child.sortOrder,
      })),
    }));

    return NextResponse.json({
      data: transformedStructure,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public organizational structure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizational structure' },
      { status: 500, headers: corsHeaders }
    );
  }
}
