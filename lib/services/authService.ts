/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/authService.ts
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { ID, OAuthProvider } from 'appwrite';
import storageService from '@/lib/appwrite/storage';


// Types for signup wizard steps
interface SignupData {
  // Step 1: Gender preference
  gender: string; // 'men' | 'women' | 'both'
  
  // Step 2: Goals (up to 3)
  goals: string[]; // ['Chat', 'Find friends', 'Have fun', etc.]
  
  // Step 3: Bio
  bio: string;
  
  // Step 4: Profile picture
  profilePic: string | null; // Base64 or file URL
  
  // Step 5: Name
  name: string;
  
  // Step 6: Email
  email: string;
  
  // Step 7: Password
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfile {
    userId: string;
    username: string;
    email: string;
    age?: number;
    gender?: string;
    goals?: string;  // ✅ NOW STRING (JSON string)
    bio?: string;
    profilePic?: string | null;
    credits: number;
    location?: string;  // ✅ NOW STRING (JSON string)
    createdAt: string;
    lastActive: string;
    preferences: string;  // ✅ NOW STRING (JSON string)
  }

export const authService = {
  /**
   * SIGNUP - Multi-step wizard
   * Creates Appwrite auth account + user profile document
   */
  async signup(signupData: SignupData): Promise<{ user: any; profile: UserProfile }> {
    try {
      // 1. Upload profile picture if provided (base64)
      let profilePicUrl: string | null = null;
      
      if (signupData.profilePic) {
        console.log('📤 Uploading profile picture...');
        profilePicUrl = await storageService.uploadProfilePictureFromBase64(
          signupData.profilePic,
          `${signupData.name}-profile.jpg`
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
  
      // 3. Create user profile document in 'users' collection
      const userProfile: UserProfile = {
        userId: authUser.$id,
        username: signupData.name,
        email: signupData.email,
        gender: signupData.gender,
        goals: JSON.stringify(signupData.goals),
        bio: signupData.bio,
        profilePic: profilePicUrl, // Store the URL, not base64
        credits: 10, // 🎁 Free welcome credits
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        preferences: JSON.stringify({
            language: 'en',
            notifications: true,
          }),
      };
  
      const profileDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id, // Use auth ID as document ID
        userProfile
      );
  
      console.log('✅ User profile created:', profileDoc.$id);
  
      // 4. Auto-login after signup
      await account.createEmailPasswordSession(signupData.email, signupData.password);
  
      console.log('✅ User auto-logged in');
  
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
  
      console.log('✅ Welcome transaction created');
  
      return {
        user: authUser,
        profile: userProfile,
      };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      // Handle specific errors
      if (error.code === 409) {
        throw new Error('An account with this email already exists');
      }
      
      throw new Error(error.message || 'Failed to create account');
    }
  },

  /**
   * LOGIN
   * Authenticates user and retrieves profile
   */
  async login(loginData: LoginData): Promise<{ user: any; profile: UserProfile }> {
    try {
      // 1. Create email/password session
      const session = await account.createEmailPasswordSession(
        loginData.email,
        loginData.password
      );

      console.log('✅ Session created:', session.$id);

      // 2. Get current user from auth
      const authUser = await account.get();

      console.log('✅ Auth user retrieved:', authUser.$id);

      // 3. Get user profile from database
      const profileDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      console.log('✅ User profile retrieved');

      // 4. Update last active timestamp
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id,
        {
          lastActive: new Date().toISOString(),
        }
      );

      return {
        user: authUser,
        profile: profileDoc as unknown as UserProfile,
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Handle specific errors
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }
      
      throw new Error(error.message || 'Failed to login');
    }
  },

  /**
   * LOGIN WITH GOOGLE (OAuth)
   * Redirects to Google OAuth
   */
  async loginWithGoogle(): Promise<void> {
    try {
      // Appwrite OAuth2 - redirects to Google
      account.createOAuth2Session(
            'google' as OAuthProvider,
            `${window.location.origin}/auth/callback`, // Success redirect
            `${window.location.origin}/login`
        );
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  },

  /**
   * GET CURRENT USER
   * Retrieves authenticated user + profile
   */
  async getCurrentUser(): Promise<{ user: any; profile: UserProfile } | null> {
    try {
      // 1. Check if user is authenticated
      const authUser = await account.get();

      if (!authUser) {
        return null;
      }

      // 2. Get user profile from database
      const profileDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      return {
        user: authUser,
        profile: profileDoc as unknown as UserProfile,
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  },

  /**
   * LOGOUT
   * Ends current session
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
   * UPDATE PROFILE
   * Updates user profile data
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        {
          ...updates,
          lastActive: new Date().toISOString(),
        }
      );

      console.log('✅ Profile updated');
      return updatedProfile as unknown as UserProfile;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
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
      // 1. Delete user profile document
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);

      // 2. Delete auth account (must be done last)
      // Note: This will automatically delete the current session
      // User needs to be logged in to delete their own account
      await account.updateStatus(); // This deletes the account
      
      console.log('✅ Account deleted');
    } catch (error: any) {
      console.error('❌ Delete account error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
  },
};

export default authService;