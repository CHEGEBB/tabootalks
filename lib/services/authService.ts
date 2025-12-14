/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/authService.ts
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { ID, OAuthProvider } from 'appwrite';
import storageService from '@/lib/appwrite/storage';

// Updated UserProfile interface to match Appwrite schema
interface UserProfile {
    [x: string]: string;
    userId: string;
    username: string;
    email: string;
    age?: number;
    gender?: string;
    goals?: string;  // JSON string (NOT array in TypeScript)
    bio?: string;
    profilePic?: string | null;
    credits: number;
    location?: string;
    createdAt: string;
    lastActive: string;
    preferences: string;  // JSON string
    birthday?: string;
    martialStatus?: string;
    fieldOfWork?: string;
    englishLevel?: string;
    languages?: string[];  // ✅ NOW ARRAY (matches Appwrite schema)
    interests?: string[];  // ✅ NOW ARRAY (matches Appwrite schema)
    personalityTraits?: string[];  // ✅ NOW ARRAY (matches Appwrite schema)
    totalChats?: number;
    totalMatches?: number;
    followingCount?: number;
    isVerified?: boolean;
    isPremium?: boolean;
}

interface SignupData {
  gender: string;
  goals: string[];
  bio: string;
  profilePic: string | null;
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  /**
   * SIGNUP - Multi-step wizard
   */
  async signup(signupData: SignupData): Promise<{ user: any; profile: UserProfile }> {
    try {
      // 1. Upload profile picture if provided
      let profilePicUrl: string | null = null;
      
      if (signupData.profilePic) {
        console.log('📤 Uploading profile picture...');
        profilePicUrl = await storageService.uploadProfilePictureFromBase64(
          signupData.profilePic,
          `${signupData.name}-profile-${Date.now()}.jpg`
        );
        console.log('✅ Profile picture uploaded:', profilePicUrl);
      }

      // 2. Create Appwrite Auth account
      const authUser = await account.create(
        ID.unique(),
        signupData.email,
        signupData.password,
        signupData.name
      );

      console.log('✅ Auth account created:', authUser.$id);

      // 3. Create user profile document - CORRECTED to match Appwrite schema
      const userProfile = {
        userId: authUser.$id,
        username: signupData.name,
        email: signupData.email,
        gender: signupData.gender || null,
        goals: signupData.goals ? JSON.stringify(signupData.goals) : null,
        bio: signupData.bio || null,
        profilePic: profilePicUrl,
        credits: 10,
        location: null,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        preferences: JSON.stringify({
            language: 'en',
            notifications: true,
        }),
        age: null,
        birthday: null,
        martialStatus: null,
        fieldOfWork: null,
        englishLevel: null,
        languages: [],  // ✅ Empty array, not JSON string
        interests: [],  // ✅ Empty array, not JSON string
        personalityTraits: [],  // ✅ Empty array, not JSON string
        totalChats: 0,
        totalMatches: 0,
        followingCount: 0,
        isVerified: false,
        isPremium: false
      };

      const profileDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id,
        userProfile
      );

      console.log('✅ User profile created:', profileDoc.$id);

      // 4. Auto-login after signup
      await account.createEmailPasswordSession(signupData.email, signupData.password);



      // 5. Create welcome credit transaction
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        ID.unique(),
        {
          transactionId: ID.unique(),
          userId: authUser.$id,
          type: 'bonus',
          amount: 10,
          description: '🎉 Welcome bonus - 10 FREE credits!',
          balanceBefore: 0,
          balanceAfter: 10,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        user: authUser,
        profile: userProfile as unknown as UserProfile,
      };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      if (error.code === 409) {
        throw new Error('An account with this email already exists');
      }
      
      throw new Error(error.message || 'Failed to create account');
    }
  },

  /**
   * LOGIN - Add this function if you don't have it
   */
  async login(loginData: LoginData): Promise<{ user: any; profile: UserProfile }> {
    try {
      // 1. Create session
      await account.createEmailPasswordSession(loginData.email, loginData.password);
      console.log('✅ Session created');

      // 2. Get user data
      const authUser = await account.get();
      
      // 3. Get profile
      const profileDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      const profile: UserProfile = {
        userId: profileDoc.userId,
        username: profileDoc.username,
        email: profileDoc.email,
        age: profileDoc.age || undefined,
        gender: profileDoc.gender || undefined,
        goals: profileDoc.goals || undefined,
        bio: profileDoc.bio || undefined,
        profilePic: profileDoc.profilePic || null,
        credits: profileDoc.credits || 0,
        location: profileDoc.location || undefined,
        createdAt: profileDoc.createdAt,
        lastActive: profileDoc.lastActive,
        preferences: profileDoc.preferences || JSON.stringify({}),
        birthday: profileDoc.birthday || undefined,
        martialStatus: profileDoc.martialStatus || undefined,
        fieldOfWork: profileDoc.fieldOfWork || undefined,
        englishLevel: profileDoc.englishLevel || undefined,
        languages: profileDoc.languages || [],
        interests: profileDoc.interests || [],
        personalityTraits: profileDoc.personalityTraits || [],
        totalChats: profileDoc.totalChats || 0,
        totalMatches: profileDoc.totalMatches || 0,
        followingCount: profileDoc.followingCount || 0,
        isVerified: profileDoc.isVerified || false,
        isPremium: profileDoc.isPremium || false
      };



      return {
        user: authUser,
        profile
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }
      
      throw new Error(error.message || 'Failed to login');
    }
  },

  /**
   * UPDATE PROFILE - FIXED VERSION
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('🔄 Updating profile for user:', userId);
      console.log('📝 Updates to apply:', updates);

      // Prepare updates object with proper data types
      const updateData: Record<string, any> = {
        lastActive: new Date().toISOString(),
      };

      // Handle specific fields conversion
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'languages' || key === 'interests' || key === 'personalityTraits') {
          // Ensure these are arrays for Appwrite
          if (typeof value === 'string') {
            try {
              // Try to parse if it's a JSON string
              const parsed = JSON.parse(value);
              updateData[key] = Array.isArray(parsed) ? parsed : [];
            } catch {
              // If not JSON, split by comma
              updateData[key] = value 
                ? value.split(',').map((item: string) => item.trim()).filter(Boolean)
                : [];
            }
          } else if (Array.isArray(value)) {
            updateData[key] = value;
          } else {
            updateData[key] = [];
          }
        } else if (key === 'goals') {
          // Store goals as JSON string
          if (Array.isArray(value)) {
            updateData[key] = JSON.stringify(value);
          } else if (typeof value === 'string') {
            updateData[key] = value;
          } else {
            updateData[key] = null;
          }
        } else if (key === 'age' && value !== undefined) {
          // Convert age to number
          updateData[key] = parseInt(value as string) || null;
        } else {
          // Store other fields as-is
          updateData[key] = value !== undefined && value !== '' ? value : null;
        }
      });

      console.log('📦 Prepared update data:', updateData);

      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        updateData
      );

      console.log('✅ Profile updated successfully');
      return updatedProfile as unknown as UserProfile;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      console.error('Error details:', error.response || error.message);
      
      if (error.code === 400) {
        throw new Error('Invalid data format. Please check your input.');
      }
      
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  /**
   * GET CURRENT USER - Enhanced with proper type conversion
   */
  async getCurrentUser(): Promise<{ user: any; profile: UserProfile } | null> {
    try {
      const authUser = await account.get();

      if (!authUser) {
        return null;
      }

      const profileDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      // Convert Appwrite document to UserProfile type
      const profile: UserProfile = {
        userId: profileDoc.userId,
        username: profileDoc.username,
        email: profileDoc.email,
        age: profileDoc.age || undefined,
        gender: profileDoc.gender || undefined,
        goals: profileDoc.goals || undefined,
        bio: profileDoc.bio || undefined,
        profilePic: profileDoc.profilePic || null,
        credits: profileDoc.credits || 0,
        location: profileDoc.location || undefined,
        createdAt: profileDoc.createdAt,
        lastActive: profileDoc.lastActive,
        preferences: profileDoc.preferences || JSON.stringify({}),
        birthday: profileDoc.birthday || undefined,
        martialStatus: profileDoc.martialStatus || undefined,
        fieldOfWork: profileDoc.fieldOfWork || undefined,
        englishLevel: profileDoc.englishLevel || undefined,
        languages: profileDoc.languages || [],  // Already array in Appwrite
        interests: profileDoc.interests || [],
        personalityTraits: profileDoc.personalityTraits || [],
        totalChats: profileDoc.totalChats || 0,
        totalMatches: profileDoc.totalMatches || 0,
        followingCount: profileDoc.followingCount || 0,
        isVerified: profileDoc.isVerified || false,
        isPremium: profileDoc.isPremium || false
      };

      return {
        user: authUser,
        profile
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  },

  /**
   * LOGOUT - WITH CONVERSATION SERVICE CLEANUP
   * Ends current session and clears all caches
   */
  async logout(): Promise<void> {
    try {
     

      // 2. Delete Appwrite session
      await account.deleteSession('current');
      console.log('✅ User logged out');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
    
      
      throw new Error(error.message || 'Failed to logout');
    }
  },

  /**
   * FORGOT PASSWORD
   * Sends password recovery email
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password` // Password reset page
      );
      console.log('✅ Password recovery email sent');
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      throw new Error(error.message || 'Failed to send recovery email');
    }
  },

  /**
   * RESET PASSWORD
   * Updates password using recovery token
   */
  async resetPassword(
    userId: string,
    secret: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await account.updateRecovery(userId, secret, newPassword);
      console.log('✅ Password reset successful');
    } catch (error: any) {
      console.error('❌ Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  /**
   * VERIFY EMAIL
   * Sends email verification
   */
  async sendVerificationEmail(): Promise<void> {
    try {
      await account.createVerification(`${window.location.origin}/verify-email`);
      console.log('✅ Verification email sent');
    } catch (error: any) {
      console.error('❌ Send verification error:', error);
      throw new Error(error.message || 'Failed to send verification email');
    }
  },

  /**
   * CONFIRM EMAIL VERIFICATION
   * Verifies email using token
   */
  async verifyEmail(userId: string, secret: string): Promise<void> {
    try {
      await account.updateVerification(userId, secret);
      console.log('✅ Email verified');
    } catch (error: any) {
      console.error('❌ Verify email error:', error);
      throw new Error(error.message || 'Failed to verify email');
    }
  },

  /**
   * DELETE ACCOUNT
   * Permanently deletes user account and data
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
     
      
      // 2. Delete user profile document
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);

      // 3. Delete auth account (must be done last)
      await account.updateStatus(); // This deletes the account
      
      console.log('✅ Account deleted');
    } catch (error: any) {
      console.error('❌ Delete account error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
  },
};

export default authService;