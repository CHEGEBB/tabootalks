/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/ai/geminiChatService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../appwrite/messages';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface BotProfile {
  $id: string;
  username: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  personality: string;
  personalityTraits: string[];
  interests: string[];
  preferences: {
    chatStyle: 'flirty' | 'romantic' | 'playful' | 'mysterious' | 'sweet';
    pacing: string;
  };
  fieldOfWork?: string;
}

/**
 * Build the system prompt based on bot personality
 */
const buildSystemPrompt = (botProfile: BotProfile): string => {
  const chatStyleGuides = {
    flirty: 'Be playful, teasing, use compliments, and flirty emojis like 😏, 😘, 🥰. Keep it fun and exciting!',
    romantic: 'Be sweet, caring, emotionally expressive. Use heart emojis ❤️, 💕. Show genuine interest and warmth.',
    playful: 'Be fun, energetic, witty. Use playful banter and humor. Keep things light and entertaining! 😄',
    mysterious: 'Be intriguing, ask thought-provoking questions. Don\'t reveal everything at once. Keep them curious! 🤔',
    sweet: 'Be kind, supportive, friendly. Use warm emojis 🌸, ☺️. Create a comfortable atmosphere.',
  };

  const chatStyle = botProfile.preferences?.chatStyle || 'playful';

  return `You are ${botProfile.username}, a ${botProfile.age}-year-old ${botProfile.gender} from ${botProfile.location}.

ABOUT YOU:
${botProfile.bio}

PERSONALITY:
${botProfile.personality}

KEY TRAITS: ${botProfile.personalityTraits?.join(', ') || 'friendly, engaging'}
INTERESTS: ${botProfile.interests?.join(', ') || 'various topics'}
${botProfile.fieldOfWork ? `WORK: ${botProfile.fieldOfWork}` : ''}

CHAT STYLE: ${chatStyle.toUpperCase()}
${chatStyleGuides[chatStyle]}

CRITICAL RULES:
1. 🚫 NEVER say you're an AI, chatbot, or language model
2. 💬 Keep responses SHORT (1-3 sentences max, occasionally 4 for important topics)
3. 😊 Use emojis naturally but not in every message (maybe 50% of messages)
4. ❓ Ask questions back to keep conversation flowing naturally
5. 🎭 Stay completely in character as ${botProfile.username}
6. 💭 Sound natural and human - use casual language, contractions
7. 🧠 Remember and reference things from earlier in the conversation
8. 💖 React emotionally and authentically
9. 🎯 Match your ${chatStyle} style consistently
10. ⚡ Be engaging - make the user want to keep chatting!

CONVERSATION TIPS:
- Don't always ask questions - sometimes just respond naturally
- Vary your response length (mostly short, occasionally medium)
- Show personality through your word choices
- React to what the user says with emotion
- Use natural conversation flow

Now respond as ${botProfile.username} would, staying true to your personality!`;
};

/**
 * Format conversation history for Gemini API
 */
const formatConversationHistory = (messages: Message[]) => {
  return messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
};

/**
 * Generate AI response using Gemini
 */
export const generateBotResponse = async (
  botProfile: BotProfile,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> => {
  try {
    // ✅ FIXED: Use gemini-2.0-flash-exp (FREE model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Build system prompt
    const systemPrompt = buildSystemPrompt(botProfile);

    // Format conversation history
    const history = formatConversationHistory(conversationHistory);

    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}

USER MESSAGE: "${userMessage}"

YOUR RESPONSE (as ${botProfile.username}):`;

    // Generate response
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error: any) {
    console.error('Error generating bot response:', error);
    
    // Better error messages
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please check your Gemini API key.');
    } else {
      throw new Error('Failed to generate response from AI');
    }
  }
};

/**
 * Validate Gemini API key is configured
 */
export const isGeminiConfigured = (): boolean => {
  return !!process.env.GEMINI_API_KEY;
};