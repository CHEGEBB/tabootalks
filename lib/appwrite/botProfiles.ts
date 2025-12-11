// lib/appwrite/botProfiles.ts
import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { BotProfile } from '../ai/groqChatService';
/**
 * Get bot profile by ID from PERSONAS collection
 */
export const getBotProfileById = async (profileId: string): Promise<BotProfile | null> => {
  try {
    const profile = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PERSONAS,
      profileId
    );

    // Parse JSON strings if they exist and map to BotProfile interface
    const botProfile: BotProfile = {
      $id: profile.$id,
      username: profile.username || profile.name || 'Unknown',
      age: profile.age || 25,
      gender: profile.gender || 'female',
      location: profile.location || 'Unknown',
      bio: profile.bio || '',
      personality: profile.personality || profile.bio || '',
      personalityTraits: Array.isArray(profile.personalityTraits) 
        ? profile.personalityTraits 
        : typeof profile.personalityTraits === 'string' 
        ? JSON.parse(profile.personalityTraits) 
        : [],
      interests: Array.isArray(profile.interests) 
        ? profile.interests 
        : typeof profile.interests === 'string' 
        ? JSON.parse(profile.interests) 
        : [],
      preferences: {
          chatStyle: profile.chatStyle ||
              (typeof profile.preferences === 'object' ? profile.preferences?.chatStyle : null) ||
              (typeof profile.preferences === 'string' ? JSON.parse(profile.preferences)?.chatStyle : null) ||
              'playful',
          pacing: ''
      }
    };

    return botProfile;
  } catch (error) {
    console.error('Error getting bot profile:', error);
    return null;
  }
};

/**
 * Get all bot profiles (for listing)
 */
export const getAllBotProfiles = async (limit: number = 50): Promise<BotProfile[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PERSONAS,
      []
    );

    return response.documents.map(profile => ({
      $id: profile.$id,
      username: profile.username || profile.name || 'Unknown',
      age: profile.age || 25,
      gender: profile.gender || 'female',
      location: profile.location || 'Unknown',
      bio: profile.bio || '',
      personality: profile.personality || profile.bio || '',
      personalityTraits: Array.isArray(profile.personalityTraits) 
        ? profile.personalityTraits 
        : typeof profile.personalityTraits === 'string' 
        ? JSON.parse(profile.personalityTraits) 
        : [],
      interests: Array.isArray(profile.interests) 
        ? profile.interests 
        : typeof profile.interests === 'string' 
        ? JSON.parse(profile.interests) 
        : [],
      preferences: {
        chatStyle: profile.chatStyle || 
                   (typeof profile.preferences === 'object' ? profile.preferences?.chatStyle : null) ||
                   (typeof profile.preferences === 'string' ? JSON.parse(profile.preferences)?.chatStyle : null) ||
                   'playful',
        pacing: '' // Add a default value for pacing
      }
    }));
  } catch (error) {
    console.error('Error getting bot profiles:', error);
    return [];
  }
};