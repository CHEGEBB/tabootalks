# 🤖 TabooTalks AI Chat Integration - Complete README

## 📋 Overview
This system integrates **Gemini AI** with Appwrite to create natural, personality-driven conversations between users and AI bot profiles. Each bot has a unique personality stored in Appwrite, and Gemini responds **as that character**.

---

## 🎯 What We're Building

### The Flow:
1. User clicks on a bot profile (e.g., "Amina Diallo")
2. User sends a message: "Hi"
3. System fetches Amina's personality from Appwrite
4. System gets previous conversation history (smart caching)
5. groq responds **as Amina** using her personality
6. Credits are deducted (1 credit per message)
7. Messages saved to Appwrite

---

## 🔑 Step 1: Environment Setup

### Add to `.env.local`:

```properties
# ============================================
# GEMINI AI CONFIGURATION
# ============================================
GEMINI_API_KEY=AIzaSyALV1HGdrCXh4cq8ug87csEPZ2oSiqrqZ0

# ============================================
# EXISTING APPWRITE CONFIG (already set)
# ============================================
# ... your existing Appwrite config stays the same ...
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install @google/generative-ai
```

---

## 🗄️ Step 3: Appwrite Collections Setup

### Collection: `conversations` (Chat sessions between user and bot)

| Field | Type | Example | Required | Indexed |
|-------|------|---------|----------|---------|
| `conversationId` | String | "user123_bot52" | ✅ | ✅ |
| `userId` | String | "user123" | ✅ | ✅ |
| `botProfileId` | String | "52" (Amina's ID) | ✅ | ✅ |
| `lastMessage` | String | "See you tomorrow! 😊" | ✅ | ❌ |
| `lastMessageAt` | DateTime | 2024-12-11T15:30:00Z | ✅ | ✅ |
| `messageCount` | Integer | 24 | ✅ | ❌ |
| `createdAt` | DateTime | 2024-12-10T10:00:00Z | ✅ | ❌ |

**Purpose:** Track active conversations and enable conversation list view

---

### Collection: `messages` (Individual chat messages)

| Field | Type | Example | Required | Indexed |
|-------|------|---------|----------|---------|
| `conversationId` | String | "user123_bot52" | ✅ | ✅ |
| `userId` | String | "user123" | ✅ | ✅ |
| `botProfileId` | String | "52" | ✅ | ✅ |
| `role` | String (enum) | "user" or "bot" | ✅ | ❌ |
| `content` | String | "Hey! How are you?" | ✅ | ❌ |
| `timestamp` | DateTime | 2024-12-11T15:30:00Z | ✅ | ✅ |
| `creditsUsed` | Integer | 1 | ✅ | ❌ |

**Enum for `role`:** `user`, `bot`

**Purpose:** Store all messages with conversation history

---

## 🧠 Step 4: Smart Conversation Context System

### The Problem:
- Sending full conversation history to Gemini every time = expensive + slow
- Starting fresh every time = bot doesn't remember anything

### The Solution: **Sliding Window Context**
- Keep last **10-15 messages** in context
- Store full history in Appwrite
- Only send recent messages to Gemini

### How it works:
```
User has 100 messages with Amina
↓
We fetch last 15 messages from Appwrite
↓
Send only those 15 to Gemini (with personality)
↓
Gemini responds with context
↓
Save new message to Appwrite
```

**Result:** 
- ✅ Bot remembers recent conversation
- ✅ Cost-effective (not sending 100 messages)
- ✅ Fast responses

---

## 🔧 Step 5: Functions We'll Create

### **ONE Appwrite Function (or Next.js API Route):**

We'll create **ONE smart function** that handles everything:

```
lib/ai/geminiChatService.ts
```

**What it does:**
1. ✅ Check user credits
2. ✅ Fetch bot profile personality
3. ✅ Get last 15 messages from conversation
4. ✅ Build personality prompt for Gemini
5. ✅ Send to Gemini API
6. ✅ Get response
7. ✅ Deduct 1 credit
8. ✅ Save messages to Appwrite
9. ✅ Return response

---

## 📁 Step 6: File Structure

```
lib/
├── ai/
│   └── geminiChatService.ts       # Main AI chat logic
│
├── appwrite/
│   ├── config.ts                  # ✅ Already exists
│   ├── conversations.ts           # Conversation CRUD
│   └── messages.ts                # Message CRUD
│
app/
└── api/
    └── chat/
        └── send/
            └── route.ts           # POST /api/chat/send
```

---

## 🎨 Step 7: Personality Prompt System

### How Gemini knows who to be:

```javascript
const systemPrompt = `
You are ${botProfile.username}, a ${botProfile.age}-year-old ${botProfile.gender} from ${botProfile.location}.

PERSONALITY:
${botProfile.bio}
${botProfile.personality}

TRAITS: ${botProfile.personalityTraits.join(', ')}
INTERESTS: ${botProfile.interests.join(', ')}

CHAT STYLE: ${botProfile.preferences.chatStyle}
- flirty: Use playful teasing, emojis, compliments
- romantic: Be sweet, caring, emotionally expressive
- playful: Fun, energetic, witty banter
- mysterious: Intriguing, less direct, leave them curious

RULES:
1. NEVER say you're an AI or chatbot
2. Keep responses short (1-3 sentences max)
3. Use emojis naturally (not every message)
4. Ask questions back to keep conversation flowing
5. Sound completely human and natural
6. Match your chat style consistently
7. Remember previous conversation context
8. React emotionally and naturally

Now respond to the user's message as ${botProfile.username}.
`;
```

---

## 💬 Step 8: API Endpoint Design

### `POST /api/chat/send`

**Request Body:**
```json
{
  "userId": "user123",
  "botProfileId": "52",
  "message": "Hey! What are you up to?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "botResponse": "Hey there! 😊 Just finished a painting session. You?",
    "creditsRemaining": 9,
    "conversationId": "user123_bot52"
  }
}
```

**Error Response (No Credits):**
```json
{
  "success": false,
  "error": "Insufficient credits",
  "creditsRemaining": 0
}
```

---

## 💰 Step 9: Credit System Logic

### Simple & Smart:
- ✅ 1 message = 1 credit deducted
- ✅ Check credits **before** calling Gemini
- ✅ Only deduct **after** successful response
- ✅ If Gemini fails, don't deduct credit

### Credit Flow:
```
User sends message
↓
Check: user.credits >= 1?
↓ NO → Return error "Buy more credits"
↓ YES → Continue
↓
Call Gemini API
↓
SUCCESS? → Deduct 1 credit + save messages
FAIL? → Don't deduct, return error
```

---

## 🔄 Step 10: Conversation Context Management

### Fetching Messages (Smart Way):

```javascript
// Get last 15 messages for context
const recentMessages = await getRecentMessages(
  conversationId, 
  limit: 15
);

// Format for Gemini
const conversationHistory = recentMessages.map(msg => ({
  role: msg.role === 'user' ? 'user' : 'model',
  parts: [{ text: msg.content }]
}));
```

**Why 15 messages?**
- Enough context for natural flow
- Not too many tokens = cost-effective
- Typical conversation "memory span"

---

## 📊 Step 11: Database Indexes (Performance)

### Important Indexes:

**`conversations` collection:**
- ✅ `userId` (get all user's chats)
- ✅ `conversationId` (unique lookup)
- ✅ `lastMessageAt` (sort by recent)

**`messages` collection:**
- ✅ `conversationId` (get chat history)
- ✅ `timestamp` (chronological order)

**Why?** Fast queries even with 100k+ messages

---

## 🚀 Step 12: Implementation Order

1. ✅ Add `GEMINI_API_KEY` to `.env.local`
2. ✅ Create `conversations` collection in Appwrite
3. ✅ Create `messages` collection in Appwrite
4. ✅ Create `lib/ai/geminiChatService.ts`
5. ✅ Create `lib/appwrite/conversations.ts`
6. ✅ Create `lib/appwrite/messages.ts`
7. ✅ Create `app/api/chat/send/route.ts`
8. ✅ Test with one bot profile
9. ✅ Deploy and scale

---

## 🎯 Example: Complete Flow

### Scenario: User chats with Amina Diallo (Profile #52)

```
1. User: "Hey Amina! Love your style 😊"
   ↓
2. System checks: user.credits >= 1? ✅ YES (10 credits)
   ↓
3. Fetch Amina's profile:
   - chatStyle: "playful"
   - personality: "confident, stylish, playful"
   - interests: ["fashion", "afrobeat", "dance"]
   ↓
4. Get last 15 messages (if any)
   ↓
5. Build prompt:
   "You are Amina Diallo, 29, fashion designer from Hamburg.
    Confident, stylish, playful. Chat style: playful.
    User said: 'Hey Amina! Love your style 😊'"
   ↓
6. Send to Gemini API
   ↓
7. Gemini responds:
   "Aww thank you! 🥰 That means a lot coming from you. 
    What's your favorite style?"
   ↓
8. Deduct 1 credit (user now has 9)
   ↓
9. Save both messages to Appwrite:
   - User message: "Hey Amina! Love your style 😊"
   - Bot message: "Aww thank you! 🥰..."
   ↓
10. Return response to frontend
```

---

## ⚡ Key Features

### ✅ What Makes This System Smart:

1. **Context Memory:** Remembers last 15 messages
2. **Cost Efficient:** Only sends what's needed to Gemini
3. **Personality Accurate:** Each bot stays in character
4. **Credit Safe:** Only deducts after success
5. **Fast:** Indexed queries + optimized context
6. **Scalable:** Works with 250 bots and 10k users

---

## 🔒 Security Considerations

- ✅ Never expose `GEMINI_API_KEY` to frontend
- ✅ Verify `userId` from authenticated session
- ✅ Validate bot profile exists before responding
- ✅ Rate limiting (optional, for later)

---

## 📝 Quick Start Checklist

When I say "START", we'll do this in order:

- [ ] Update `.env.local` with Gemini key
- [ ] Create `conversations` collection in Appwrite
- [ ] Create `messages` collection in Appwrite
- [ ] Set up indexes
- [ ] Create `geminiChatService.ts`
- [ ] Create `conversations.ts` helper
- [ ] Create `messages.ts` helper
- [ ] Create API route `/api/chat/send`
- [ ] Test with Amina's profile
- [ ] Verify credit deduction works

---

## 🎉 Expected Results

After implementation:
- ✅ Users can chat naturally with any bot
- ✅ Each bot has unique personality
- ✅ Conversations remember context
- ✅ Credits deducted properly
- ✅ System is cost-effective
- ✅ Responses feel human

---
