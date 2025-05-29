
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchArtistById, updateArtistProfile } from '@/services/artistService';
import { Artist } from '@/types/artist';
import { toast } from 'sonner';

interface UseArtistProfileOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

export const useArtistProfile = (
  artistId?: string, 
  options: UseArtistProfileOptions = {}
) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use provided artistId or fallback to current user's id
  const targetId = artistId || user?.id;
  
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000 // 5 minutes
  } = options;
  
  const profileQuery = useQuery({
    queryKey: ['artistProfile', targetId],
    queryFn: async () => {
      if (!targetId) {
        throw new Error('No artist ID provided');
      }
      
      console.log('Fetching artist profile for ID:', targetId);
      
      const profile = await fetchArtistById(targetId);
      
      if (!profile) {
        throw new Error(`Artist profile not found for ID: ${targetId}`);
      }
      
      console.log('Successfully loaded artist profile:', profile.full_name);
      return profile;
    },
    enabled: !!targetId && enabled,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      console.log(`Artist profile fetch attempt ${failureCount + 1} failed:`, error);
      
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<Artist>) => {
      if (!user?.id) {
        throw new Error('User must be authenticated to update profile');
      }
      
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('No profile data provided for update');
      }
      
      console.log('Updating profile with data:', profileData);
      
      const result = await updateArtistProfile(user.id, profileData);
      
      if (!result) {
        throw new Error('Profile update failed');
      }
      
      return result;
    },
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(['artistProfile', targetId], updatedProfile);
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artistProfile'] });
      
      console.log('Profile updated successfully:', updatedProfile.full_name);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      
      // Show user-friendly error message
      const errorMessage = error?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });
  
  // Helper function to refresh profile data
  const refreshProfile = async () => {
    try {
      console.log('Refreshing profile data...');
      await profileQuery.refetch();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast.error('Failed to refresh profile data');
    }
  };
  
  // Helper function to check if profile is complete
  const isProfileComplete = (profile?: Artist) => {
    if (!profile) return false;
    
    return !!(
      profile.full_name &&
      profile.email &&
      profile.bio &&
      profile.category &&
      profile.experience_level
    );
  };
  
  return {
    // Data
    profile: profileQuery.data,
    
    // Loading states
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    isUpdating: updateProfileMutation.isPending,
    
    // Error states
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateError: updateProfileMutation.error,
    
    // Actions
    updateProfile: updateProfileMutation.mutate,
    refreshProfile,
    refetch: profileQuery.refetch,
    
    // Status checks
    canEdit: user?.id === targetId,
    isOwnProfile: user?.id === targetId,
    isProfileComplete: isProfileComplete(profileQuery.data),
    
    // Query status
    isStale: profileQuery.isStale,
    dataUpdatedAt: profileQuery.dataUpdatedAt,
    
    // Helper for resetting errors
    clearErrors: () => {
      updateProfileMutation.reset();
    }
  };
};
