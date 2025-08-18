import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/site-settings - Get all site settings
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object for easier usage
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type,
        descriptionAr: setting.descriptionAr,
        descriptionEn: setting.descriptionEn,
        category: setting.category,
        isPublic: setting.isPublic,
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ 
      settings: settingsObject,
      rawSettings: settings 
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
            type: 'string',
            category: 'general',
            isPublic: false,
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
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
