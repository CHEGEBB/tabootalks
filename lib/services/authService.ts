/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/authService.ts - COMPLETE WITH AUTO EMAIL VERIFICATION
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { ID } from 'appwrite';
import storageService from '@/lib/appwrite/storage';

interface UserProfile {
  $id?: string;
  userId?: string;
  username: string;
  email: string;
  age?: number;
  gender?: string;
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
   * SIGNUP - WITH AUTO EMAIL VERIFICATION
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
      console.log('✅ Session created');

      // 5. 🔥 SEND VERIFICATION EMAIL AUTOMATICALLY AFTER SIGNUP
      try {
        const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`;
        await account.createVerification(verificationUrl);
        console.log('✅ Verification email sent to:', signupData.email);
        console.log('📧 Check your inbox for the verification link!');
      } catch (emailError: any) {
        console.warn('⚠️ Failed to send verification email:', emailError.message);
        // Don't fail signup if email sending fails
      }

      // 6. Create welcome credit transaction
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
        profile: {
          ...userProfile,
          $id: profileDoc.$id,
        } as UserProfile,
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
      await account.createEmailPasswordSession(loginData.email, loginData.password);
      console.log('✅ Session created');

      const authUser = await account.get();
      
      const profileDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      const profile: UserProfile = {
        $id: profileDoc.$id,
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

      return { user: authUser, profile };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }
      
      throw new Error(error.message || 'Failed to login');
    }
  },

  /**
   * UPDATE PROFILE
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('🔄 Updating profile for user:', userId);

      const updateData: Record<string, any> = {
        lastActive: new Date().toISOString(),
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || key === '$id') {
          return;
        }

        if (key === 'languages' || key === 'interests' || key === 'personalityTraits') {
          if (Array.isArray(value)) {
            updateData[key] = value;
          } else if (typeof value === 'string') {
            updateData[key] = value.split(',').map(s => s.trim()).filter(Boolean);
          } else {
            updateData[key] = [];
          }
        } else if (key === 'goals') {
          updateData[key] = Array.isArray(value) ? JSON.stringify(value) : value;
        } else if (key === 'age') {
          updateData[key] = typeof value === 'string' ? parseInt(value) : value;
        } else {
          updateData[key] = value;
        }
      });

      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        updateData
      );

      console.log('✅ Profile updated successfully');
      
      return {
        $id: updatedProfile.$id,
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
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  /**
   * UPDATE EMAIL
   */
  async updateEmail(newEmail: string): Promise<void> {
    try {
      console.log('🔄 Updating email to:', newEmail);
      
      await account.updateEmail(newEmail, '');
      
      const authUser = await account.get();
      
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authUser.$id,
        {
          email: newEmail,
          isVerified: false,
          lastActive: new Date().toISOString()
        }
      );

      // Send verification email for new email
      try {
        const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`;
        await account.createVerification(verificationUrl);
        console.log('✅ Verification email sent to new address');
      } catch (emailError) {
        console.warn('⚠️ Failed to send verification email');
      }
      
      console.log('✅ Email updated successfully');
    } catch (error: any) {
      console.error('❌ Update email error:', error);
      
      if (error.code === 409) {
        throw new Error('This email is already in use');
      }
      
      throw new Error(error.message || 'Failed to update email');
    }
  },

  /**
   * UPDATE PASSWORD
   */
  async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
    try {
      console.log('🔄 Updating password...');
      
      await account.updatePassword(newPassword, oldPassword);
      
      console.log('✅ Password updated successfully');
    } catch (error: any) {
      console.error('❌ Update password error:', error);
      
      if (error.code === 401) {
        throw new Error('Current password is incorrect');
      }
      
      throw new Error(error.message || 'Failed to update password');
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
        $id: profileDoc.$id,
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

      return { user: authUser, profile };
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
        `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`
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
   * SEND VERIFICATION EMAIL - MANUAL TRIGGER
   */
  async sendVerificationEmail(): Promise<void> {
    try {
      console.log('📧 Sending verification email...');
      
      const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`;
      await account.createVerification(verificationUrl);
      
      console.log('✅ Verification email sent - Check your inbox!');
    } catch (error: any) {
      console.error('❌ Send verification error:', error);
      
      if (error.code === 429) {
        throw new Error('Too many requests. Please wait a few minutes before trying again.');
      }
      
      if (error.message?.includes('already verified')) {
        throw new Error('Your email is already verified!');
      }
      
      throw new Error(error.message || 'Failed to send verification email');
    }
  },

  /**
   * VERIFY EMAIL - CONFIRM VERIFICATION
   */
  async verifyEmail(userId: string, secret: string): Promise<void> {
    try {
      console.log('🔍 Verifying email for user:', userId);
      
      // Verify with Appwrite
      await account.updateVerification(userId, secret);
      console.log('✅ Email verified with Appwrite');
      
      // Update database
      try {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          userId,
          {
            isVerified: true,
            lastActive: new Date().toISOString()
          }
        );
        console.log('✅ Database updated - isVerified = true');
      } catch (dbError) {
        console.warn('⚠️ Database update failed:', dbError);
      }
      
      console.log('🎉 Email verification complete!');
    } catch (error: any) {
      console.error('❌ Verify email error:', error);
      
      if (error.code === 401) {
        throw new Error('Invalid or expired verification link. Please request a new one.');
      }
      
      if (error.message?.includes('already verified')) {
        throw new Error('Your email is already verified!');
      }
      
      throw new Error(error.message || 'Failed to verify email. The link may have expired.');
    }
  },

  /**
   * CHECK IF EMAIL IS VERIFIED
   */
  async isEmailVerified(): Promise<boolean> {
    try {
      const user = await account.get();
      return user.emailVerification || false;
    } catch (error) {
      console.error('❌ Check verification error:', error);
      return false;
    }
  },

  /**
   * DELETE ACCOUNT
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
      await account.deleteSession('current');
      
      console.log('✅ Account deleted');
    } catch (error: any) {
      console.error('❌ Delete account error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
  },
};

export default authService;