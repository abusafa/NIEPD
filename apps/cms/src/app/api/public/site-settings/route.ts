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

// GET /api/public/site-settings - Public site settings endpoint for website
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc',
      },
    });

    // Transform into a more usable format
    const settingsMap: Record<string, any> = {};
    const rawSettings: any[] = [];
    
    settings.forEach(setting => {
      rawSettings.push(setting);
      settingsMap[setting.key] = {
        valueAr: setting.valueAr,
        valueEn: setting.valueEn,
        type: setting.type,
        groupName: setting.groupName,
      };
    });

    return NextResponse.json({
      settings: settingsMap,
      rawSettings: rawSettings,
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500, headers: corsHeaders }
    );
  }
}
