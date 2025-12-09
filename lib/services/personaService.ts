/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/personaService.ts
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query } from 'appwrite';

// Persona Profile Interface (matches your Appwrite collection)
export interface PersonaProfile {
  $id: string;
  profileNumber: number;
  username: string;
  email: string;
  gender: string;
  age: number;
  birthday: string;
  bio: string;
  profilePic: string;
  additionalPhotos: string[];
  location: string;
  interests: string[];
  personalityTraits: string[];
  personality: string;
  fieldOfWork: string;
  englishLevel: string;
  languages: string[];
  martialStatus: string;
  credits: number;
  totalChats: number;
  totalMatches: number;
  followingCount: number;
  isVerified: boolean;
  isPremium: boolean;
  preferences: string; // JSON string
  goals: string; // JSON string
  createdAt: string;
  lastActive: string;
  $createdAt: string;
  $updatedAt: string;
}

// Parsed versions for easier frontend use
export interface ParsedPersonaProfile extends Omit<PersonaProfile, 'preferences' | 'goals'> {
  [x: string]: any;
  preferences: {
    ageRange?: [number, number];
    distance?: number;
    lookingFor?: string;
  };
  goals: {
    chatStyle?: string;
    pacing?: string;
  };
}

// Filter options for fetching personas
export interface PersonaFilters {
  gender?: 'male' | 'female';
  minAge?: number;
  maxAge?: number;
  location?: string;
  interests?: string[];
  isVerified?: boolean;
  isPremium?: boolean;
  limit?: number;
  offset?: number;
}

export const personaService = {
  /**
   * GET ALL PERSONAS
   * Fetch all persona profiles with optional filters
   */
  async getAllPersonas(filters?: PersonaFilters): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🔍 Fetching personas with filters:', filters);

      const queries: string[] = [];

      // Apply filters
      if (filters?.gender) {
        queries.push(Query.equal('gender', filters.gender));
      }

      if (filters?.minAge) {
        queries.push(Query.greaterThanEqual('age', filters.minAge));
      }

      if (filters?.maxAge) {
        queries.push(Query.lessThanEqual('age', filters.maxAge));
      }

      if (filters?.location) {
        queries.push(Query.equal('location', filters.location));
      }

      if (filters?.isVerified !== undefined) {
        queries.push(Query.equal('isVerified', filters.isVerified));
      }

      if (filters?.isPremium !== undefined) {
        queries.push(Query.equal('isPremium', filters.isPremium));
      }

      // Pagination
      if (filters?.limit) {
        queries.push(Query.limit(filters.limit));
      }

      if (filters?.offset) {
        queries.push(Query.offset(filters.offset));
      }

      // Sort by lastActive (most recent first)
      queries.push(Query.orderDesc('lastActive'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        queries
      );

      console.log(`✅ Fetched ${response.documents.length} personas`);

      // Parse and return
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas:', error);
      throw new Error(error.message || 'Failed to fetch personas');
    }
  },

  /**
   * GET PERSONA BY ID
   * Fetch a single persona profile by document ID
   */
  async getPersonaById(personaId: string): Promise<ParsedPersonaProfile> {
    try {
      console.log('🔍 Fetching persona:', personaId);

      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        personaId
      );

      console.log('✅ Persona fetched');
      return this.parsePersona(doc);
    } catch (error: any) {
      console.error('❌ Error fetching persona:', error);
      throw new Error(error.message || 'Failed to fetch persona');
    }
  },

  /**
   * GET RANDOM PERSONAS
   * Fetch random personas for discovery/matching
   */
  async getRandomPersonas(count: number = 10, excludeIds: string[] = []): Promise<ParsedPersonaProfile[]> {
    try {
      console.log(`🎲 Fetching ${count} random personas`);

      // Fetch more than needed to allow for filtering
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.limit(count * 2),
          Query.orderDesc('lastActive')
        ]
      );

      // Filter out excluded IDs
      let personas = response.documents
        .filter((doc: any) => !excludeIds.includes(doc.$id))
        .map((doc: any) => this.parsePersona(doc));

      // Shuffle and limit
      personas = this.shuffleArray(personas).slice(0, count);

      console.log(`✅ Fetched ${personas.length} random personas`);
      return personas;
    } catch (error: any) {
      console.error('❌ Error fetching random personas:', error);
      throw new Error(error.message || 'Failed to fetch random personas');
    }
  },

  /**
   * SEARCH PERSONAS
   * Search personas by username or bio
   */
  async searchPersonas(searchTerm: string, limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🔍 Searching personas:', searchTerm);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('username', searchTerm),
          Query.limit(limit)
        ]
      );

      console.log(`✅ Found ${response.documents.length} personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error searching personas:', error);
      throw new Error(error.message || 'Failed to search personas');
    }
  },

  /**
   * GET PERSONAS BY INTEREST
   * Find personas with specific interests
   */
  async getPersonasByInterest(interest: string, limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🔍 Fetching personas with interest:', interest);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('interests', interest),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      console.log(`✅ Found ${response.documents.length} personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas by interest:', error);
      throw new Error(error.message || 'Failed to fetch personas by interest');
    }
  },

  /**
   * GET VERIFIED PERSONAS
   * Fetch only verified persona profiles
   */
  async getVerifiedPersonas(limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.equal('isVerified', true),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      console.log(`✅ Fetched ${response.documents.length} verified personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching verified personas:', error);
      throw new Error(error.message || 'Failed to fetch verified personas');
    }
  },

  /**
   * GET PREMIUM PERSONAS
   * Fetch premium persona profiles
   */
  async getPremiumPersonas(limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.equal('isPremium', true),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      console.log(`✅ Fetched ${response.documents.length} premium personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching premium personas:', error);
      throw new Error(error.message || 'Failed to fetch premium personas');
    }
  },

  /**
   * GET PERSONAS BY LOCATION
   * Fetch personas in a specific location
   */
  async getPersonasByLocation(location: string, limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🔍 Fetching personas in location:', location);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.equal('location', location),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      console.log(`✅ Found ${response.documents.length} personas in ${location}`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas by location:', error);
      throw new Error(error.message || 'Failed to fetch personas by location');
    }
  },

  /**
   * UPDATE PERSONA STATS
   * Update interaction statistics (totalChats, totalMatches, etc.)
   */
  async updatePersonaStats(
    personaId: string,
    updates: {
      totalChats?: number;
      totalMatches?: number;
      followingCount?: number;
      lastActive?: string;
    }
  ): Promise<void> {
    try {
      console.log('📊 Updating persona stats:', personaId);

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        personaId,
        {
          ...updates,
          lastActive: updates.lastActive || new Date().toISOString()
        }
      );

      console.log('✅ Persona stats updated');
    } catch (error: any) {
      console.error('❌ Error updating persona stats:', error);
      throw new Error(error.message || 'Failed to update persona stats');
    }
  },

  /**
   * INCREMENT PERSONA CHAT COUNT
   * Increment totalChats when a new conversation starts
   */
  async incrementChatCount(personaId: string): Promise<void> {
    try {
      const persona = await this.getPersonaById(personaId);
      await this.updatePersonaStats(personaId, {
        totalChats: persona.totalChats + 1,
        lastActive: new Date().toISOString()
      });
      console.log('✅ Chat count incremented');
    } catch (error: any) {
      console.error('❌ Error incrementing chat count:', error);
      throw new Error(error.message || 'Failed to increment chat count');
    }
  },

  /**
   * PARSE PERSONA
   * Helper function to parse JSON strings into objects
   */
  parsePersona(doc: any): ParsedPersonaProfile {
    return {
      ...doc,
      preferences: this.safeParseJSON(doc.preferences, {}),
      goals: this.safeParseJSON(doc.goals, {}),
      additionalPhotos: Array.isArray(doc.additionalPhotos) ? doc.additionalPhotos : [],
      interests: Array.isArray(doc.interests) ? doc.interests : [],
      personalityTraits: Array.isArray(doc.personalityTraits) ? doc.personalityTraits : [],
      languages: Array.isArray(doc.languages) ? doc.languages : []
    };
  },

  /**
   * SAFE JSON PARSE
   * Safely parse JSON strings with fallback
   */
  safeParseJSON(jsonString: string, fallback: any = {}): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  },

  /**
   * SHUFFLE ARRAY
   * Fisher-Yates shuffle algorithm
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * GET PERSONA COUNT
   * Get total number of personas
   */
  async getPersonaCount(): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [Query.limit(1)]
      );
      return response.total;
    } catch (error: any) {
      console.error('❌ Error getting persona count:', error);
      return 0;
    }
  },

  /**
   * GET PERSONAS BY GENDER
   * Quick filter by gender
   */
  async getPersonasByGender(gender: 'male' | 'female', limit: number = 20): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.equal('gender', gender),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      console.log(`✅ Found ${response.documents.length} ${gender} personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas by gender:', error);
      throw new Error(error.message || 'Failed to fetch personas by gender');
    }
  }
};

export default personaService;