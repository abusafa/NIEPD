import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/contact-messages/[id] - Get a specific contact message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: message });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact message' },
      { status: 500 }
    );
  }
}

// PUT /api/contact-messages/[id] - Update contact message status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Contact message updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

// DELETE /api/contact-messages/[id] - Delete a contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}
