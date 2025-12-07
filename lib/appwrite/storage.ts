/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/appwrite/storage.ts
import { storage, STORAGE_BUCKETS } from './config';
import { ID } from 'appwrite';

export const storageService = {
  /**
   * Upload profile picture to Appwrite Storage
   * Returns the file URL
   */
  async uploadProfilePicture(file: File): Promise<string> {
    try {
      // 1. Upload file to storage
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKETS.PROFILE_PHOTOS,
        ID.unique(),
        file
      );

      console.log('✅ Profile picture uploaded:', uploadedFile.$id);

      // 2. Get the file view URL (public URL)
      const fileUrl = storage.getFileView(
        STORAGE_BUCKETS.PROFILE_PHOTOS,
        uploadedFile.$id
      );

      return fileUrl.toString();
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      throw new Error(error.message || 'Failed to upload profile picture');
    }
  },

  /**
   * Upload from base64 string
   */
  async uploadProfilePictureFromBase64(base64String: string, filename: string = 'profile.jpg'): Promise<string> {
    try {
      // Convert base64 to blob
      const base64Data = base64String.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const file = new File([blob], filename, { type: 'image/jpeg' });

      // Upload the file
      return await this.uploadProfilePicture(file);
    } catch (error: any) {
      console.error('❌ Base64 upload error:', error);
      throw new Error(error.message || 'Failed to upload profile picture');
    }
  },

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(fileId: string): Promise<void> {
    try {
      await storage.deleteFile(STORAGE_BUCKETS.PROFILE_PHOTOS, fileId);
      console.log('✅ Profile picture deleted');
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      throw new Error(error.message || 'Failed to delete profile picture');
    }
  },
};

export default storageService;