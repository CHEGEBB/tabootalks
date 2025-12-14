/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/authService.ts
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { ID } from 'appwrite';
import storageService from '@/lib/appwrite/storage';

// Fixed UserProfile interface - consistent everywhere
interface UserProfile {
  userId?: string;  // Optional
  username: string;
  email: string;
  age?: number;
  gender?: string;
  goals?: string;  // JSON string
  bio?: string;
  profilePic?: string;  // No | null
  credits: number;
  location?: string;
  createdAt: string;
  lastActive: string;
  preferences: string;  // JSON string
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
      let profilePicUrl: string | undefined = undefined;
      
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

      // 3. Create user profile document
      const userProfile = {
        userId: authUser.$id,
        username: signupData.name,
        email: signupData.email,
        gender: signupData.gender || undefined,
        goals: signupData.goals ? JSON.stringify(signupData.goals) : undefined,
        bio: signupData.bio || undefined,
        profilePic: profilePicUrl,
        credits: 10,
        location: undefined,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        preferences: JSON.stringify({
          language: 'en',
          notifications: true,
        }),
        age: undefined,
        birthday: undefined,
        martialStatus: undefined,
        fieldOfWork: undefined,
        englishLevel: undefined,
        languages: [],
        interests: [],
        personalityTraits: [],
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
        profile: userProfile as UserProfile,
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
   * LOGIN
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
        age: profileDoc.age,
        gender: profileDoc.gender,
        goals: profileDoc.goals,
        bio: profileDoc.bio,
        profilePic: profileDoc.profilePic,
        credits: profileDoc.credits || 0,
        location: profileDoc.location,
        createdAt: profileDoc.createdAt,
        lastActive: profileDoc.lastActive,
        preferences: profileDoc.preferences || JSON.stringify({}),
        birthday: profileDoc.birthday,
        martialStatus: profileDoc.martialStatus,
        fieldOfWork: profileDoc.fieldOfWork,
        englishLevel: profileDoc.englishLevel,
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
   * UPDATE PROFILE - FIXED
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('🔄 Updating profile for user:', userId);
      console.log('📝 Updates to apply:', updates);

      const updateData: Record<string, any> = {
        lastActive: new Date().toISOString(),
      };

      // Handle each field properly
      Object.entries(updates).forEach(([key, value]) => {
        // Skip undefined and empty strings
        if (value === undefined || value === '') {
          return;
        }

        if (key === 'languages' || key === 'interests' || key === 'personalityTraits') {
          // Arrays - ensure they're arrays
          if (Array.isArray(value)) {
            updateData[key] = value;
          } else if (typeof value === 'string') {
            updateData[key] = value.split(',').map(s => s.trim()).filter(Boolean);
          } else {
            updateData[key] = [];
          }
        } else if (key === 'goals') {
          // Goals stored as JSON string
          updateData[key] = Array.isArray(value) ? JSON.stringify(value) : value;
        } else if (key === 'age') {
          // Age as number
          updateData[key] = typeof value === 'string' ? parseInt(value) : value;
        } else {
          // Everything else
          updateData[key] = value;
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
      
      return {
        userId: updatedProfile.userId,
        username: updatedProfile.username,
        email: updatedProfile.email,
        age: updatedProfile.age,
        gender: updatedProfile.gender,
        goals: updatedProfile.goals,
        bio: updatedProfile.bio,
        profilePic: updatedProfile.profilePic,
        credits: updatedProfile.credits || 0,
        location: updatedProfile.location,
        createdAt: updatedProfile.createdAt,
        lastActive: updatedProfile.lastActive,
        preferences: updatedProfile.preferences,
        birthday: updatedProfile.birthday,
        martialStatus: updatedProfile.martialStatus,
        fieldOfWork: updatedProfile.fieldOfWork,
        englishLevel: updatedProfile.englishLevel,
        languages: updatedProfile.languages || [],
        interests: updatedProfile.interests || [],
        personalityTraits: updatedProfile.personalityTraits || [],
        totalChats: updatedProfile.totalChats || 0,
        totalMatches: updatedProfile.totalMatches || 0,
        followingCount: updatedProfile.followingCount || 0,
        isVerified: updatedProfile.isVerified || false,
        isPremium: updatedProfile.isPremium || false
      };
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      console.error('Error details:', error.response || error.message);
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  /**
   * GET CURRENT USER
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

      const profile: UserProfile = {
        userId: profileDoc.userId,
        username: profileDoc.username,
        email: profileDoc.email,
        age: profileDoc.age,
        gender: profileDoc.gender,
        goals: profileDoc.goals,
        bio: profileDoc.bio,
        profilePic: profileDoc.profilePic,
        credits: profileDoc.credits || 0,
        location: profileDoc.location,
        createdAt: profileDoc.createdAt,
        lastActive: profileDoc.lastActive,
        preferences: profileDoc.preferences || JSON.stringify({}),
        birthday: profileDoc.birthday,
        martialStatus: profileDoc.martialStatus,
        fieldOfWork: profileDoc.fieldOfWork,
        englishLevel: profileDoc.englishLevel,
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
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  },

  /**
   * LOGOUT
   */
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
      console.log('✅ User logged out');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  },

  /**
   * FORGOT PASSWORD
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      console.log('✅ Password recovery email sent');
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      throw new Error(error.message || 'Failed to send recovery email');
    }
  },

  /**
   * RESET PASSWORD
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
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      // Delete user profile document
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);

      // Delete auth account
      await account.updateStatus();
      
      console.log('✅ Account deleted');
    } catch (error: any) {
      console.error('❌ Delete account error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
  },
};

export default authService;