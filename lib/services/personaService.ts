/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/personaService.ts - FINAL CORRECTED VERSION
// Handles BOTH user.gender (preference) AND persona.gender (actual gender)

import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query } from 'appwrite';

// THE ACTUAL PROBLEM AND SOLUTION:
// 
// USERS collection:
//   - gender field = preference = "women", "men", "both"
//
// PERSONAS collection:
//   - gender field = actual gender = should be "male" or "female"
//   - BUT your data might have "men"/"women" or "Male"/"Female"
//
// SOLUTION: We need to map correctly AND handle variations

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
  preferences: string;
  goals: string;
  createdAt: string;
  lastActive: string;
  $createdAt: string;
  $updatedAt: string;
}

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

export interface UserProfile {
  $id: string;
  userId?: string;
  username: string;
  email: string;
  age?: number;
  gender?: string; // "women", "men", "both"
  goals?: string;
  bio?: string;
  profilePic?: string | null;
  credits: number;
  location?: string;
  createdAt: string;
  lastActive: string;
  preferences: string;
  birthday?: string;
  martialStatus?: string;
  fieldOfWork?: string;
  englishLevel?: string;
  languages?: string[];
  interests?: string[];
  personalityTraits?: string[];
  totalChats?: number;
  totalMatches?: number;
  followingCount?: number;
  isVerified?: boolean;
  isPremium?: boolean;
}

export const personaService = {
  /**
   * 🎯 SMART FETCH PERSONAS - CORRECTLY HANDLES ALL GENDER VARIATIONS
   */
  async smartFetchPersonas(
    userProfile: UserProfile,
    additionalFilters?: Omit<PersonaFilters, 'gender'>
  ): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🎯 Smart fetching personas for user:', userProfile.username);
      console.log('👤 User gender preference:', userProfile.gender);

      // Fetch ALL personas first (no gender filter in query)
      const queries: string[] = [];

      // Apply additional filters
      if (additionalFilters?.minAge) {
        queries.push(Query.greaterThanEqual('age', additionalFilters.minAge));
      }

      if (additionalFilters?.maxAge) {
        queries.push(Query.lessThanEqual('age', additionalFilters.maxAge));
      }

      if (additionalFilters?.location) {
        queries.push(Query.equal('location', additionalFilters.location));
      }

      if (additionalFilters?.isVerified !== undefined) {
        queries.push(Query.equal('isVerified', additionalFilters.isVerified));
      }

      if (additionalFilters?.isPremium !== undefined) {
        queries.push(Query.equal('isPremium', additionalFilters.isPremium));
      }

      queries.push(Query.limit(5000));

      if (additionalFilters?.offset) {
        queries.push(Query.offset(additionalFilters.offset));
      }

      queries.push(Query.orderDesc('lastActive'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        queries
      );

      console.log(`📦 Fetched ${response.documents.length} total personas`);

      // Parse all personas
      let personas = response.documents.map((doc: any) => this.parsePersona(doc));

      // 🔥 NOW FILTER BY GENDER PREFERENCE IN JAVASCRIPT
      const userGenderPreference = userProfile.gender?.toLowerCase().trim();
      
      console.log('🔍 User wants to see:', userGenderPreference);

      if (userGenderPreference === 'women' || userGenderPreference === 'woman') {
        // User wants WOMEN → keep only FEMALE personas
        personas = personas.filter(p => this.isFemalePersona(p.gender));
        console.log(`💃 Filtered to ${personas.length} FEMALE personas`);
      } else if (userGenderPreference === 'men' || userGenderPreference === 'man') {
        // User wants MEN → keep only MALE personas
        personas = personas.filter(p => this.isMalePersona(p.gender));
        console.log(`🕺 Filtered to ${personas.length} MALE personas`);
      } else {
        // User wants BOTH → keep all
        console.log(`🌈 Keeping all ${personas.length} personas (both genders)`);
      }

      return personas;
    } catch (error: any) {
      console.error('❌ Error in smart fetch:', error);
      throw new Error(error.message || 'Failed to smart fetch personas');
    }
  },

  /**
   * 🔥 CHECK IF PERSONA IS MALE
   * Handles: "male", "Male", "MALE", "men", "Men", "man", "Man"
   */
  isMalePersona(gender: string): boolean {
    if (!gender) return false;
    const g = gender.toLowerCase().trim();
    return g === 'male' || g === 'men' || g === 'man' || g === 'm';
  },

  /**
   * 🔥 CHECK IF PERSONA IS FEMALE
   * Handles: "female", "Female", "FEMALE", "women", "Women", "woman", "Woman"
   */
  isFemalePersona(gender: string): boolean {
    if (!gender) return false;
    const g = gender.toLowerCase().trim();
    return g === 'female' || g === 'women' || g === 'woman' || g === 'f';
  },

  /**
   * 🔥 SMART FETCH WITH VARIETY
   */
  async smartFetchWithVariety(
    userProfile: UserProfile,
    excludeIds: string[] = [],
    additionalFilters?: Omit<PersonaFilters, 'gender'>
  ): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🎲 Fetching personas with variety...');

      const allPersonas = await this.smartFetchPersonas(userProfile, additionalFilters);

      let filteredPersonas = allPersonas.filter(
        (persona) => !excludeIds.includes(persona.$id) && persona.$id !== userProfile.$id
      );

      filteredPersonas = this.shuffleArray(filteredPersonas);

      console.log(`✅ Returning ${filteredPersonas.length} personas with variety`);
      return filteredPersonas;
    } catch (error: any) {
      console.error('❌ Error fetching with variety:', error);
      throw new Error(error.message || 'Failed to fetch personas with variety');
    }
  },

  /**
   * 🎯 GET DISCOVERY FEED
   */
  async getDiscoveryFeed(
    userProfile: UserProfile,
    viewedIds: string[] = [],
    count: number = 50
  ): Promise<ParsedPersonaProfile[]> {
    try {
      console.log(`🎯 Generating discovery feed for ${userProfile.username}`);

      const personas = await this.smartFetchWithVariety(userProfile, viewedIds);
      const feed = personas.slice(0, count);

      console.log(`✅ Discovery feed ready: ${feed.length} personas`);
      return feed;
    } catch (error: any) {
      console.error('❌ Error generating discovery feed:', error);
      throw new Error(error.message || 'Failed to generate discovery feed');
    }
  },

  /**
   * 🔍 SEARCH PERSONAS FOR USER
   */
  async searchPersonasForUser(
    userProfile: UserProfile,
    searchTerm: string,
    limit: number = 100
  ): Promise<ParsedPersonaProfile[]> {
    try {
      console.log('🔍 Searching personas for user:', searchTerm);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('username', searchTerm),
          Query.limit(limit)
        ]
      );

      let personas = response.documents.map((doc: any) => this.parsePersona(doc));

      // Filter by gender preference
      const userGenderPreference = userProfile.gender?.toLowerCase().trim();
      
      if (userGenderPreference === 'women' || userGenderPreference === 'woman') {
        personas = personas.filter(p => this.isFemalePersona(p.gender));
      } else if (userGenderPreference === 'men' || userGenderPreference === 'man') {
        personas = personas.filter(p => this.isMalePersona(p.gender));
      }

      console.log(`✅ Found ${personas.length} personas matching search`);
      return personas;
    } catch (error: any) {
      console.error('❌ Error searching personas:', error);
      throw new Error(error.message || 'Failed to search personas');
    }
  },

  /**
   * GET ALL PERSONAS (Original)
   */
  async getAllPersonas(filters?: PersonaFilters): Promise<ParsedPersonaProfile[]> {
    try {
      const queries: string[] = [];

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

      queries.push(Query.limit(5000));

      if (filters?.offset) {
        queries.push(Query.offset(filters.offset));
      }

      queries.push(Query.orderDesc('lastActive'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        queries
      );

      console.log(`✅ Fetched ${response.documents.length} personas`);
      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas:', error);
      throw new Error(error.message || 'Failed to fetch personas');
    }
  },

  /**
   * GET PERSONA BY ID
   */
  async getPersonaById(personaId: string): Promise<ParsedPersonaProfile> {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        personaId
      );

      return this.parsePersona(doc);
    } catch (error: any) {
      console.error('❌ Error fetching persona:', error);
      throw new Error(error.message || 'Failed to fetch persona');
    }
  },

  /**
   * GET RANDOM PERSONAS
   */
  async getRandomPersonas(count: number = 50, excludeIds: string[] = []): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.limit(5000),
          Query.orderDesc('lastActive')
        ]
      );

      let personas = response.documents
        .filter((doc: any) => !excludeIds.includes(doc.$id))
        .map((doc: any) => this.parsePersona(doc));

      personas = this.shuffleArray(personas).slice(0, count);

      return personas;
    } catch (error: any) {
      console.error('❌ Error fetching random personas:', error);
      throw new Error(error.message || 'Failed to fetch random personas');
    }
  },

  /**
   * SEARCH PERSONAS
   */
  async searchPersonas(searchTerm: string, limit: number = 100): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('username', searchTerm),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error searching personas:', error);
      throw new Error(error.message || 'Failed to search personas');
    }
  },

  /**
   * GET PERSONAS BY INTEREST
   */
  async getPersonasByInterest(interest: string, limit: number = 100): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('interests', interest),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      return response.documents.map((doc: any) => this.parsePersona(doc));
    } catch (error: any) {
      console.error('❌ Error fetching personas by interest:', error);
      throw new Error(error.message || 'Failed to fetch personas by interest');
    }
  },

  /**
   * GET PERSONAS BY INTEREST FOR USER
   */
  async getPersonasByInterestForUser(
    userProfile: UserProfile,
    interest: string,
    limit: number = 100
  ): Promise<ParsedPersonaProfile[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        [
          Query.search('interests', interest),
          Query.limit(limit),
          Query.orderDesc('lastActive')
        ]
      );

      let personas = response.documents.map((doc: any) => this.parsePersona(doc));

      // Filter by gender
      const userGenderPreference = userProfile.gender?.toLowerCase().trim();
      
      if (userGenderPreference === 'women' || userGenderPreference === 'woman') {
        personas = personas.filter(p => this.isFemalePersona(p.gender));
      } else if (userGenderPreference === 'men' || userGenderPreference === 'man') {
        personas = personas.filter(p => this.isMalePersona(p.gender));
      }

      return personas;
    } catch (error: any) {
      console.error('❌ Error fetching personas by interest:', error);
      throw new Error(error.message || 'Failed to fetch personas by interest');
    }
  },

  /**
   * UPDATE PERSONA STATS
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
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PERSONAS,
        personaId,
        {
          ...updates,
          lastActive: updates.lastActive || new Date().toISOString()
        }
      );
    } catch (error: any) {
      console.error('❌ Error updating persona stats:', error);
      throw new Error(error.message || 'Failed to update persona stats');
    }
  },

  /**
   * INCREMENT PERSONA CHAT COUNT
   */
  async incrementChatCount(personaId: string): Promise<void> {
    try {
      const persona = await this.getPersonaById(personaId);
      await this.updatePersonaStats(personaId, {
        totalChats: persona.totalChats + 1,
        lastActive: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Error incrementing chat count:', error);
      throw new Error(error.message || 'Failed to increment chat count');
    }
  },

  /**
   * INCREMENT PERSONA MATCH COUNT
   */
  async incrementMatchCount(personaId: string): Promise<void> {
    try {
      const persona = await this.getPersonaById(personaId);
      await this.updatePersonaStats(personaId, {
        totalMatches: persona.totalMatches + 1,
        lastActive: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Error incrementing match count:', error);
      throw new Error(error.message || 'Failed to increment match count');
    }
  },

  /**
   * PARSE PERSONA
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
      return 0;
    }
  },

  /**
   * GET STATS FOR USER
   */
  async getStatsForUser(userProfile: UserProfile): Promise<{
    total: number;
    male: number;
    female: number;
    available: number;
    verified: number;
    premium: number;
  }> {
    try {
      const allPersonas = await this.smartFetchPersonas(userProfile);
      
      const stats = {
        total: allPersonas.length,
        male: allPersonas.filter(p => this.isMalePersona(p.gender)).length,
        female: allPersonas.filter(p => this.isFemalePersona(p.gender)).length,
        available: allPersonas.length,
        verified: allPersonas.filter(p => p.isVerified).length,
        premium: allPersonas.filter(p => p.isPremium).length
      };

      return stats;
    } catch (error: any) {
      return {
        total: 0,
        male: 0,
        female: 0,
        available: 0,
        verified: 0,
        premium: 0
      };
    }
  }
};

export default personaService;