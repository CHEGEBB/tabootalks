// app/api/chat/mark-read/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // For now, just return success since we don't have this feature yet
  return NextResponse.json({
    success: true,
    message: 'Messages marked as read'
  });
}