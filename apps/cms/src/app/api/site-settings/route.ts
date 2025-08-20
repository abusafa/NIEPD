import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET /api/site-settings - Get all site settings
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object for easier usage
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        valueAr: setting.valueAr,
        valueEn: setting.valueEn,
        type: setting.type,
        groupName: setting.groupName,
      };
      return acc;
    }, {} as Record<string, { key: string; value: string; groupName: string }>);

    return NextResponse.json({ 
      settings: settingsObject,
      rawSettings: settings 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500, headers: corsHeaders });
  }
}

// PUT /api/site-settings - Update multiple settings
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    // Update each setting
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { 
            valueEn: String(value),
            valueAr: String(value) // For now, store same value in both languages
          },
          create: {
            key,
            valueEn: String(value),
            valueAr: String(value),
            type: 'text',
            groupName: 'general',
          },
        })
      );
    }

    await Promise.all(updates);

    // Return updated settings
    const updatedSettings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    });

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: updatedSettings 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
