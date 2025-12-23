// lib/appwrite/config.ts
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // https://fra.cloud.appwrite.io/v1
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // tabootalks

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export Database ID
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Export Collection IDs
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!,
  BOT_PROFILES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOT_PROFILES!,
  CONVERSATIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CONVERSATIONS!,
  MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_MESSAGES!,
  CREDIT_TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CREDIT_TRANSACTIONS!,
  LIKES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LIKES!,
  FOLLOWS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_FOLLOWS!,
  POSTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_POSTS!,
  PERSONAS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PERSONAS!,
  TRANSACTIONS: 'transactions',
  GIFTS: 'gifts',
  GIFT_HISTORY: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GIFT_HISTORY || 'gifts', // Add this line with fallback
};

// Export Storage Bucket IDs
export const STORAGE_BUCKETS = {
  PROFILE_PHOTOS: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE_PHOTOS!,
  CHAT_IMAGES: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_CHAT_IMAGES!,
};

// ============ NEW: FUNCTION DOMAINS ============
export const FUNCTION_DOMAINS = {
  AI_CHATBOT: 'https://693bd0b100117232836e.fra.appwrite.run',
  CREDIT_HANDLER: 'https://693bd2ed00102f4a9a90.fra.appwrite.run'
};

// ============ NEW: DIRECT FUNCTION CALLS ============
export const FUNCTION_ENDPOINTS = {
  CHAT_SEND: 'https://693bd0b100117232836e.fra.appwrite.run',
  CREDIT_ADD: 'https://693bd2ed00102f4a90.fra.appwrite.run',
  CREDIT_CHECK: 'https://693bd2ed00102f4a90.fra.appwrite.run',
  CREDIT_DEDUCT: 'https://693bd2ed00102f4a90.fra.appwrite.run'
};

// Helper function to check if Appwrite is configured
export const isAppwriteConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  );
};

// Export client for advanced usage
export { client };

export default client;