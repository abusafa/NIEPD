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

// GET /api/public/navigation - Public navigation endpoint for website
export async function GET(request: NextRequest) {
  try {
    const navigation = await prisma.navigation.findMany({
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
    const rootItems = navigation.filter(item => !item.parentId);

    // Transform data for public consumption with nested structure
    const transformedNavigation = rootItems.map(item => ({
      id: item.id,
      labelAr: item.labelAr,
      labelEn: item.labelEn,
      url: item.url,
      target: item.target,
      sortOrder: item.sortOrder,
      children: item.children.map(child => ({
        id: child.id,
        labelAr: child.labelAr,
        labelEn: child.labelEn,
        url: child.url,
        target: child.target,
        sortOrder: child.sortOrder,
      })),
    }));

    return NextResponse.json({
      data: transformedNavigation,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500, headers: corsHeaders }
    );
  }
}
