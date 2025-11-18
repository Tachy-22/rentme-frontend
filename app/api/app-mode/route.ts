import { NextResponse } from 'next/server';
import { getAppMode } from '@/actions/system/getAppMode';

export async function GET() {
  try {
    const result = await getAppMode();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in app-mode API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get app mode' },
      { status: 500 }
    );
  }
}