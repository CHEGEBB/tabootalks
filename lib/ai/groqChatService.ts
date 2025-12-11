/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/ai/groqChatService.ts
import Groq from 'groq-sdk';
import { Message } from '../appwrite/messages';

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

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
 * Format conversation history for Groq API
 */
const formatConversationHistory = (messages: Message[]) => {
  return messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
};

/**
 * Generate AI response using Groq
 */
export const generateBotResponse = async (
  botProfile: BotProfile,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> => {
  try {
    // Build system prompt
    const systemPrompt = buildSystemPrompt(botProfile);

    // Format conversation history
    const history = formatConversationHistory(conversationHistory);

    // Build messages array - DO NOT include the current user message in history
    // The user message is already in conversationHistory
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    // Generate response with Groq
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.9,
      max_tokens: 200,
      top_p: 0.95,
    });

    const text = response.choices[0]?.message?.content || '';
    return text.trim();
  } catch (error: any) {
    console.error('Error generating bot response:', error);
    
    // Better error messages
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please check your Groq API key.');
    } else if (error.message?.includes('401')) {
      throw new Error('Invalid API key. Please check your GROQ_API_KEY in .env.local');
    } else {
      throw new Error('Failed to generate response from AI');
    }
  }
};

/**
 * Validate Groq API key is configured
 */
export const isGroqConfigured = (): boolean => {
  return !!process.env.GROQ_API_KEY;
};