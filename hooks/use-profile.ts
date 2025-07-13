import { useState, useEffect } from 'react';
import { profileService } from '@/lib/profile-service';

/**
 * Custom hook for accessing and managing user profile data
 */
export function useProfile() {
  // Initialize with data from session storage if available
  const [profileData, setProfileData] = useState(() => profileService.getCurrentProfile());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Check session storage on mount to avoid unnecessary API calls
  useEffect(() => {
    const sessionProfile = profileService.getProfileFromSession();
    if (sessionProfile && !profileData) {
      setProfileData(sessionProfile);
    }
  }, []);

  /**
   * Fetch profile data for a specific user
   * @param email User email address
   */
const fetchProfile = async (email: string) => {
    // Check if we already have profile data in session storage
    const existingProfile = profileService.getProfileFromSession();
    if (existingProfile && existingProfile.email === email) {
      // If profile is already loaded with matching email, use it
      setProfileData(existingProfile);
      return existingProfile;
    }
    
    // Otherwise fetch from API
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.fetchProfile(email);
      setProfileData(data);
      return data;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update profile data
   * @param updatedData Updated profile data
   */
  const updateProfile = async (updatedData: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.updateProfile(updatedData);
      setProfileData(data);
      return data;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear profile data from session and state
   */
  const clearProfile = () => {
    profileService.clearProfile();
    setProfileData(null);
  };

  return {
    profile: profileData,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearProfile,
  };
}
