/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/typing/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simple endpoint to manage typing indicators
const typingSessions = new Map<string, NodeJS.Timeout>();

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId, isTyping = true } = await request.json();
    
    if (!conversationId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing conversationId or userId' },
        { status: 400 }
      );
    }
    
    const sessionKey = `${conversationId}_${userId}`;
    
    if (isTyping) {
      // Clear any existing timeout
      if (typingSessions.has(sessionKey)) {
        clearTimeout(typingSessions.get(sessionKey));
      }
      
      // Set new timeout (auto-clear after 5 seconds)
      const timeout = setTimeout(() => {
        typingSessions.delete(sessionKey);
      }, 5000);
      
      typingSessions.set(sessionKey, timeout);
      
      return NextResponse.json({
        success: true,
        isTyping: true,
        sessionId: sessionKey,
        expiresAt: Date.now() + 5000
      });
    } else {
      // Clear typing indicator
      if (typingSessions.has(sessionKey)) {
        clearTimeout(typingSessions.get(sessionKey));
        typingSessions.delete(sessionKey);
      }
      
      return NextResponse.json({
        success: true,
        isTyping: false
      });
    }
    
  } catch (error: any) {
    console.error('Typing API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversationId');
  const userId = url.searchParams.get('userId');
  
  if (!conversationId || !userId) {
    return NextResponse.json(
      { success: false, error: 'Missing parameters' },
      { status: 400 }
    );
  }
  
  const sessionKey = `${conversationId}_${userId}`;
  const isTyping = typingSessions.has(sessionKey);
  
  return NextResponse.json({
    success: true,
    isTyping,
    sessionKey,
    activeSessions: Array.from(typingSessions.keys())
  });
}