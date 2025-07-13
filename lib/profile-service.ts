// Profile Service - Handles user profile data and related API calls
import { felixApi } from "./api-service";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  role: string;
  public_key: string;
  secret_key: string;
  password?: string;
  entity_belongs: string;
  entity_admin_name: string;
  created_at: string;
  updated_at: string;
}

class ProfileService {
  private static instance: ProfileService;
  private profileData: ProfileData | null = null;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Fetches user profile data from the API
   * @param email User email address
   * @returns ProfileData object
   */
public async fetchProfile(email: string): Promise<ProfileData> {
    try {
      // Call the profile API endpoint using the API service
      const response = await felixApi.fetchUserProfile(email);
      
      // Extract user data from the response
      if (response && response.user) {
        this.profileData = response.user;
        
        // Store profile data in session storage
        this.saveProfileToSession(response.user);
        
        return response.user;
      } else {
        throw new Error('Invalid profile response format');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Saves profile data to session storage
   * @param profileData Profile data to save
   */
  private saveProfileToSession(profileData: ProfileData): void {
    try {
      sessionStorage.setItem('felix_profile_data', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving profile to session storage:', error);
    }
  }

  /**
   * Retrieves profile data from session storage
   * @returns ProfileData object or null if not found
   */
  public getProfileFromSession(): ProfileData | null {
    try {
      const profileStr = sessionStorage.getItem('felix_profile_data');
      return profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
      console.error('Error retrieving profile from session storage:', error);
      return null;
    }
  }

  /**
   * Gets current profile data, first checking session storage
   * @returns ProfileData object or null if not available
   */
  public getCurrentProfile(): ProfileData | null {
    return this.profileData || this.getProfileFromSession();
  }

  /**
   * Updates user profile data
   * @param profileData Updated profile data
   */
  public async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      // This would call your actual update profile API endpoint
      // For now, we're just updating the local cache
      const currentData = this.getCurrentProfile();
      
      if (!currentData) {
        throw new Error('No profile data available to update');
      }
      
      const updatedData = { ...currentData, ...profileData };
      this.profileData = updatedData;
      this.saveProfileToSession(updatedData);
      
      return updatedData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Clears profile data from session storage and memory
   */
  public clearProfile(): void {
    this.profileData = null;
    sessionStorage.removeItem('felix_profile_data');
  }
}

export const profileService = ProfileService.getInstance();
