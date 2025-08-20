import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateErrorReportSchema = z.object({
  status: z.enum(['NEW', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedToId: z.string().optional().nullable(),
  resolutionNotesAr: z.string().optional(),
  resolutionNotesEn: z.string().optional(),
});

// GET /api/error-reports/[id] - Get a specific error report
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const errorReport = await prisma.errorReport.findUnique({
      where: {
        id: params.id,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    if (!errorReport) {
      return NextResponse.json(
        { error: 'Error report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: errorReport,
    });
  } catch (error) {
    console.error('Error fetching error report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error report' },
      { status: 500 }
    );
  }
}

// PATCH /api/error-reports/[id] - Update a specific error report
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    
    // Validate the request body
    const result = updateErrorReportSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: result.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const updateData = result.data;

    // If status is being updated to RESOLVED, set resolvedAt timestamp
    if (updateData.status === 'RESOLVED') {
      (updateData as Record<string, unknown>).resolvedAt = new Date();
    }

    // If status is changed from RESOLVED to something else, clear resolvedAt
    if (updateData.status && updateData.status !== 'RESOLVED') {
      (updateData as Record<string, unknown>).resolvedAt = null;
    }

    const errorReport = await prisma.errorReport.update({
      where: {
        id: params.id,
      },
      data: {
        ...updateData,
        // Convert empty strings to null for optional fields
        assignedToId: updateData.assignedToId === '' ? null : updateData.assignedToId,
        resolutionNotesAr: updateData.resolutionNotesAr === '' ? null : updateData.resolutionNotesAr,
        resolutionNotesEn: updateData.resolutionNotesEn === '' ? null : updateData.resolutionNotesEn,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    console.log('🐛 Error report updated:', errorReport.id, updateData);

    return NextResponse.json({
      success: true,
      data: errorReport,
      message: 'Error report updated successfully',
    });
  } catch (error) {
    console.error('Error updating error report:', error);
    
    if (error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).code === 'P2025') {
      return NextResponse.json(
        { error: 'Error report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update error report' },
      { status: 500 }
    );
  }
}

// DELETE /api/error-reports/[id] - Delete a specific error report
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await prisma.errorReport.delete({
      where: {
        id: params.id,
      },
    });

    console.log('🐛 Error report deleted:', params.id);

    return NextResponse.json({
      success: true,
      message: 'Error report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting error report:', error);
    
    if (error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).code === 'P2025') {
      return NextResponse.json(
        { error: 'Error report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete error report' },
      { status: 500 }
    );
  }
}
