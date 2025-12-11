// lib/appwrite/users.ts
import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { Query } from 'appwrite';

export interface User {
  $id: string;
  userId: string;
  username: string;
  email: string;
  credits: number;
  gender?: string;
  bio?: string;
  profilePic?: string;
  location?: string;
  age?: number;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0] as unknown as User;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Get user by document ID
 */
export const getUserByDocId = async (docId: string): Promise<User | null> => {
  try {
    const user = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      docId
    );

    return user as unknown as User;
  } catch (error) {
    console.error('Error getting user by doc ID:', error);
    return null;
  }
};

/**
 * Check if user has enough credits
 */
export const hasEnoughCredits = async (
  userId: string,
  requiredCredits: number = 1
): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    if (!user) return false;

    return user.credits >= requiredCredits;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
};

/**
 * Deduct credits from user
 */
export const deductCredits = async (
  userId: string,
  amount: number = 1
): Promise<number> => {
  try {
    // Get user
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      throw new Error('User not found');
    }

    const user = response.documents[0];
    const currentCredits = user.credits || 0;

    if (currentCredits < amount) {
      throw new Error('Insufficient credits');
    }

    // Update credits
    const updatedUser = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {
        credits: currentCredits - amount,
      }
    );

    return updatedUser.credits;
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw error;
  }
};

/**
 * Get user's remaining credits
 */
export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    const user = await getUserById(userId);
    return user?.credits || 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
};

/**
 * Add credits to user
 */
export const addCredits = async (
  userId: string,
  amount: number
): Promise<number> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      throw new Error('User not found');
    }

    const user = response.documents[0];
    const currentCredits = user.credits || 0;

    const updatedUser = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {
        credits: currentCredits + amount,
      }
    );

    return updatedUser.credits;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
};