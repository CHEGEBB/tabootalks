# 🔥 TabooTalks - Appwrite Backend

Backend configuration for TabooTalks using Appwrite BaaS (Backend as a Service).

**Setup Method:** All collections, attributes, and permissions are created directly in the Appwrite Console (browser-based).

---

## 📁 Project Structure

```
appwrite/
├── README.md                      # This file
│
├── functions/                     # Serverless functions
│   └── ai-chat-bot/              
│       ├── src/
│       │   └── main.js           # AI bot response logic
│       ├── package.json
│       └── README.md
│
└── docs/                         
    └── setup-guide.md            # Step-by-step console setup
```

---

## 🗄️ Database Collections (Tables)

Create these **8 collections** in your Appwrite Console:

### 1. **users**
User profiles linked to Appwrite Auth.

**Attributes:**
- `userId` - String, Required
- `username` - String, Required  
- `age` - Integer, Required
- `credits` - Integer, Default: 10
- `location` - String (JSON format)
- `createdAt` - DateTime
- `lastActive` - DateTime
- `preferences` - String (JSON format)

**Permissions:**
- Read: Users (own documents only)
- Create: Users
- Update: Users (own documents only)

---

### 2. **bot_profiles** 
250 AI female chat bots.

**Attributes:**
- `profileId` - String, Required, Unique
- `name` - String, Required
- `age` - Integer, Required
- `bio` - String (5000 chars)
- `interests` - String (JSON array)
- `location` - String (JSON format)
- `photos` - String (JSON array - file IDs)
- `personality` - String (for AI prompts)
- `isOnline` - Boolean, Default: true
- `lastSeen` - DateTime
- `stats` - String (JSON format)

**Permissions:**
- Read: Any (public)
- Create: None (admins create via console)
- Update: None
- Delete: None

---

### 3. **conversations**
Chat conversations between users and bots.

**Attributes:**
- `conversationId` - String, Required, Unique
- `userId` - String, Required
- `botProfileId` - String, Required
- `status` - String (enum: active/archived)
- `unreadCount` - Integer, Default: 0
- `lastMessage` - String (JSON format)
- `createdAt` - DateTime
- `updatedAt` - DateTime

**Permissions:**
- Read: Users (own conversations only)
- Create: Users
- Update: Users + Server

---

### 4. **messages**
Individual chat messages.

**Attributes:**
- `messageId` - String, Required, Unique
- `conversationId` - String, Required
- `senderId` - String, Required
- `senderType` - String (enum: user/bot)
- `content` - String (JSON format)
- `creditCost` - Integer (1 for text, 15 for images)
- `timestamp` - DateTime
- `isRead` - Boolean, Default: false

**Permissions:**
- Read: Users (via conversation ownership)
- Create: Users + Server
- Update: Server only

---

### 5. **credit_transactions**
Credit purchase and usage history.

**Attributes:**
- `transactionId` - String, Required, Unique
- `userId` - String, Required
- `type` - String (enum: purchase/spend/bonus)
- `amount` - Integer (positive or negative)
- `description` - String
- `balanceBefore` - Integer
- `balanceAfter` - Integer
- `metadata` - String (JSON format, optional)
- `timestamp` - DateTime

**Permissions:**
- Read: Users (own transactions only)
- Create: Server only
- Update: None

---

### 6. **likes**
User likes on bot profiles.

**Attributes:**
- `likeId` - String, Required, Unique
- `userId` - String, Required
- `botProfileId` - String, Required
- `timestamp` - DateTime

**Permissions:**
- Read: Users (own likes only)
- Create: Users
- Delete: Users (own likes only)

---

### 7. **follows**
Newsfeed follows.

**Attributes:**
- `followId` - String, Required, Unique
- `userId` - String, Required
- `botProfileId` - String, Required
- `timestamp` - DateTime

**Permissions:**
- Read: Users (own follows only)
- Create: Users
- Delete: Users (own follows only)

---

### 8. **posts**
Newsfeed posts from bot profiles.

**Attributes:**
- `postId` - String, Required, Unique
- `botProfileId` - String, Required
- `content` - String (JSON format)
- `likes` - Integer, Default: 0
- `createdAt` - DateTime

**Permissions:**
- Read: Any (public)
- Create: None (admins create via console)
- Update: None

---

## 📦 Storage Buckets

Create **2 buckets** in Appwrite Console:

### 1. **profile-photos**
Bot profile pictures.
- Max file size: 5MB
- Allowed: image/jpeg, image/png, image/webp
- Permissions: Public read, Admin write

### 2. **chat-images**  
User-sent images in chats.
- Max file size: 10MB
- Allowed: image/jpeg, image/png, image/webp, image/gif
- Permissions: Users can read/write own files

---

## 🤖 Appwrite Functions

### AI Chat Bot Function
**Purpose:** Generates AI responses when users send messages.

**How it works:**
1. User sends message (frontend)
2. Frontend calls this function
3. Function reads bot personality from `bot_profiles`
4. Function calls OpenAI API
5. Function saves bot reply to `messages`
6. User sees reply in realtime

**Location:** `/appwrite/functions/ai-chat-bot/`

**Environment Variables (set in Appwrite Console):**
- `OPENAI_API_KEY` - Your OpenAI key
- `DATABASE_ID` - Your Appwrite database ID
- `APPWRITE_API_KEY` - Server API key

---

## 🔌 Frontend Integration

Your Next.js app connects to Appwrite using these files:

```
app/lib/
├── appwrite/
│   ├── config.ts              # Appwrite client setup
│   ├── auth.ts                # Login, signup, logout
│   ├── database.ts            # Database queries
│   ├── storage.ts             # Image upload/download
│   └── realtime.ts            # Live chat updates
│
└── services/
    ├── authService.ts         # Auth logic
    ├── chatService.ts         # Send/receive messages
    ├── profileService.ts      # Fetch profiles
    └── creditService.ts       # Credit management
```

**Environment Variables** (in `/tabootalks/.env.local`):
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE=profile-bucket-id
NEXT_PUBLIC_APPWRITE_BUCKET_CHAT=chat-bucket-id
NEXT_PUBLIC_APPWRITE_FUNCTION_CHATBOT=chatbot-function-id
```

---

## 🚀 Setup Checklist

**In Appwrite Console (cloud.appwrite.io):**

- [ ] Create new project "TabooTalks"
- [ ] Create database "tabootalks-db"
- [ ] Create 8 collections (see above)
- [ ] Set attributes for each collection
- [ ] Configure permissions on each collection
- [ ] Create 2 storage buckets
- [ ] Deploy AI chat bot function
- [ ] Copy all IDs to `.env.local`

**In Your Code:**

- [ ] Create `/app/lib/appwrite/` folder
- [ ] Create integration files (config, auth, database, etc.)
- [ ] Update hooks to use Appwrite
- [ ] Test authentication flow
- [ ] Test chat messaging
- [ ] Test credit system

---

## 🔐 Important Notes

1. **All setup happens in browser console** - No JSON imports needed
2. **Appwrite Auth** handles user login/signup automatically
3. **Functions run on Appwrite servers** - No need for separate backend
4. **Realtime subscriptions** give you live chat updates
5. **Storage buckets** handle all image uploads

---

## 📞 Quick Reference

**Appwrite Console:** https://cloud.appwrite.io  
**Appwrite Docs:** https://appwrite.io/docs  
**Functions Guide:** https://appwrite.io/docs/products/functions  
**Database Guide:** https://appwrite.io/docs/products/databases

---

## 💡 Why This Structure?

- **Clean separation:** Backend config isolated from frontend code
- **Easy maintenance:** All database schemas documented in one place  
- **Simple deployment:** Functions live in their own folders
- **Clear documentation:** README explains everything you create in console

---

**Next Steps:**
1. Create collections in Appwrite Console
2. Build the AI chat bot function
3. Connect frontend to Appwrite

Questions? Check `/appwrite/docs/setup-guide.md` for detailed steps!