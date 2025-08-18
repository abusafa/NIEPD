import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/media - List all media files (public access)
export async function GET(request: NextRequest) {
  try {
    // Media GET is now publicly accessible - no authentication required
    // This allows the MediaSelector to work without login

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (type && type !== 'all') {
      switch (type) {
        case 'image':
          where.mimeType = { startsWith: 'image/' };
          break;
        case 'video':
          where.mimeType = { startsWith: 'video/' };
          break;
        case 'audio':
          where.mimeType = { startsWith: 'audio/' };
          break;
        case 'document':
          where.mimeType = { in: ['application/pdf', 'text/plain', 'application/msword'] };
          break;
      }
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      media,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload media files
export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media');
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max size is 100MB.` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(file.name);
      const baseName = path.basename(file.name, extension)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      const filename = `${timestamp}-${baseName}${extension}`;
      const filePath = path.join(uploadDir, filename);
      const publicPath = `/uploads/media/${filename}`;

      // Save file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Save to database
      const mediaRecord = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: publicPath,
        },
      });

      uploadedFiles.push(mediaRecord);
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
