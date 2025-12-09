// lib/appwrite/config.ts
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your Project ID

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export Database ID
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Export Collection IDs (same as collection names)
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!,
  BOT_PROFILES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOT_PROFILES!,
  CONVERSATIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CONVERSATIONS!,
  MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_MESSAGES!,
  TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TRANSACTIONS!,
  LIKES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LIKES!,
  FOLLOWS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_FOLLOWS!,
  POSTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_POSTS!,
  PERSONAS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PERSONAS!, // ✅ NEW

};

// Export Storage Bucket IDs
export const STORAGE_BUCKETS = {
  PROFILE_PHOTOS: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE_PHOTOS!,
  CHAT_IMAGES: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_CHAT_IMAGES!,
};

// Export Function IDs
export const FUNCTIONS = {
  AI_CHATBOT: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_AI_CHATBOT!,
  CREDIT_HANDLER: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_CREDIT_HANDLER!,
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