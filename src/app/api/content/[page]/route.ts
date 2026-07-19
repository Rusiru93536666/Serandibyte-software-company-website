import { NextRequest, NextResponse } from 'next/server';
import { getContent, updateContent } from '../../../lib/content';
import { isAuthenticated } from '../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const page = params.page;
    const content = await getContent(page);
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const page = params.page;
    const body = await request.json();
    
    await updateContent(page, body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content updated successfully' 
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}