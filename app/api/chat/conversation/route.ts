/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/conversation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConversationMessages } from '@/lib/appwrite/messages';
import { getOrCreateConversation } from '@/lib/appwrite/conversations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const botProfileId = searchParams.get('botProfileId');

  if (!userId || !botProfileId) {
    return NextResponse.json(
      { success: false, error: 'Missing userId or botProfileId' },
      { status: 400 }
    );
  }

  try {
    // Get conversation
    const conversation = await getOrCreateConversation(userId, botProfileId);
    
    // Get messages
    const messages = await getConversationMessages(conversation.conversationId, 50);
    
    return NextResponse.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg.$id,
          sender: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        conversationId: conversation.conversationId
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}