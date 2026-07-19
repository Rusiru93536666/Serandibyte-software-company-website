import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '../../lib/content';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 'home';
    const content = await getContent(page);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}