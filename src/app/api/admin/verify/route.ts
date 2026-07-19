import { NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser } from '../../../lib/auth';

export async function GET() {
  try {
    const authenticated = isAuthenticated();
    const user = getCurrentUser();

    return NextResponse.json({
      success: true,
      authenticated,
      user: user || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}