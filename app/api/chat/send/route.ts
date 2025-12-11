/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBotProfileById } from '@/lib/appwrite/botProfiles';
import { generateBotResponse, isGroqConfigured } from '@/lib/ai/groqChatService';
import { 
  getOrCreateConversation, 
  updateConversation 
} from '@/lib/appwrite/conversations';
import { 
  saveMessage, 
  getRecentMessages 
} from '@/lib/appwrite/messages';
import { 
  hasEnoughCredits, 
  deductCredits, 
  getUserCredits 
} from '@/lib/appwrite/users';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, botProfileId, message } = body;

    // Validate input
    if (!userId || !botProfileId || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: userId, botProfileId, or message' 
        },
        { status: 400 }
      );
    }

    // Check if Groq is configured
    if (!isGroqConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service not configured. Please add GROQ_API_KEY to environment variables.' 
        },
        { status: 500 }
      );
    }

    // Step 1: Check user credits
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      const remainingCredits = await getUserCredits(userId);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient credits. Please purchase more credits to continue chatting.',
          creditsRemaining: remainingCredits 
        },
        { status: 402 }
      );
    }

    // Step 2: Get bot profile from PERSONAS collection
    const botProfile = await getBotProfileById(botProfileId);
    if (!botProfile) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Bot profile not found with ID: ${botProfileId}` 
        },
        { status: 404 }
      );
    }

    // Step 3: Get or create conversation
    const conversation = await getOrCreateConversation(userId, botProfileId);
    const conversationId = conversation.conversationId;

    // Step 4: Save user message FIRST
    try {
      await saveMessage(
        conversationId,
        userId,
        botProfileId,
        'user',
        message,
        0
      );
    } catch (saveError: any) {
      console.error('Error saving user message:', saveError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save your message. Please try again.' 
        },
        { status: 500 }
      );
    }

    // Step 5: Get recent messages for context (AFTER saving user message)
    // This now includes the user's message we just saved
    const recentMessages = await getRecentMessages(conversationId, 15);

    // Step 6: Generate AI response using Groq
    let botResponse: string;
    try {
      botResponse = await generateBotResponse(
        botProfile,
        message,
        recentMessages
      );
    } catch (aiError: any) {
      console.error('AI generation error:', aiError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate response. Please try again.',
          details: aiError.message 
        },
        { status: 500 }
      );
    }

    // Step 7: Save bot response
    try {
      await saveMessage(
        conversationId,
        userId,
        botProfileId,
        'bot',
        botResponse,
        1
      );
    } catch (saveError: any) {
      console.error('Error saving bot message:', saveError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save bot response. Please try again.' 
        },
        { status: 500 }
      );
    }

    // Step 8: Deduct credits AFTER successful response
    let remainingCredits: number;
    try {
      remainingCredits = await deductCredits(userId, 1);
    } catch (creditError: any) {
      console.error('Error deducting credits:', creditError);
      remainingCredits = await getUserCredits(userId);
    }

    // Step 9: Update conversation with last message
    try {
      await updateConversation(conversationId, botResponse);
    } catch (updateError: any) {
      console.error('Error updating conversation:', updateError);
    }

    // Step 10: Return success response
    return NextResponse.json({
      success: true,
      data: {
        botResponse,
        creditsRemaining: remainingCredits,
        conversationId,
        botName: botProfile.username,
        timestamp: new Date().toISOString()
      },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const groqConfigured = isGroqConfigured();
  
  return NextResponse.json({
    success: true,
    message: 'Chat API is running',
    groqConfigured,
    timestamp: new Date().toISOString(),
    status: groqConfigured ? 'ready' : 'missing_api_key'
  });
}