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

// GET /api/public/contact-info - Public contact info endpoint for website
export async function GET(request: NextRequest) {
  try {
    const contactInfo = await prisma.contactInfo.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    // Group by type for easier consumption
    const groupedContactInfo = contactInfo.reduce((acc: any, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push({
        id: item.id,
        type: item.type,
        labelAr: item.labelAr,
        labelEn: item.labelEn,
        valueAr: item.valueAr,
        valueEn: item.valueEn,
        icon: item.icon,
        sortOrder: item.sortOrder,
      });
      return acc;
    }, {});

    return NextResponse.json({
      data: contactInfo,
      grouped: groupedContactInfo,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500, headers: corsHeaders }
    );
  }
}
