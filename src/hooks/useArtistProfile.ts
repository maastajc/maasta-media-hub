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
        throw new Error('No artist ID provided - user may not be logged in');
      }
      
      console.log('useArtistProfile: Starting fetch for ID:', targetId);
      
      try {
        const profile = await fetchArtistById(targetId);
        
        if (!profile) {
          throw new Error(`Artist profile not found for ID: ${targetId}`);
        }
        
        return profile;
      } catch (error: any) {
        console.error('useArtistProfile: Fetch failed with error:', error.message);
        throw error;
      }
    },
    enabled: !!targetId && enabled,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      console.log(`useArtistProfile: Retry attempt ${failureCount + 1}, error:`, error?.message);
      
      // Don't retry on specific errors
      if (error?.message?.includes('not found') || 
          error?.message?.includes('Invalid artist ID') ||
          error?.message?.includes('user may not be logged in')) {
        return false;
      }
      
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<Artist>) => {
      if (!user?.id) {
        throw new Error('User must be authenticated to update profile');
      }
      
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('No profile data provided for update');
      }
      
      // The updateArtistProfile function now handles the type conversion internally
      const result = await updateArtistProfile(user.id, profileData);
      
      if (!result) {
        throw new Error('Profile update failed');
      }
      
      return result;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['artistProfile', targetId], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['featuredArtists'] });
      
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error.message);
      
      const errorMessage = error?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });
  
  const refreshProfile = async () => {
    try {
      console.log('Refreshing profile data...');
      const result = await Promise.race([
        profileQuery.refetch(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Refresh timeout')), 15000)
        )
      ]);
      return result;
    } catch (error: any) {
      console.error('Error refreshing profile:', error.message);
      toast.error('Failed to refresh profile data');
      throw error;
    }
  };
  
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
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    isUpdating: updateProfileMutation.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateError: updateProfileMutation.error,
    updateProfile: updateProfileMutation.mutate,
    refreshProfile,
    refetch: profileQuery.refetch,
    canEdit: user?.id === targetId,
    isOwnProfile: user?.id === targetId,
    isProfileComplete: isProfileComplete(profileQuery.data),
    isStale: profileQuery.isStale,
    dataUpdatedAt: profileQuery.dataUpdatedAt,
    clearErrors: () => {
      updateProfileMutation.reset();
    }
  };
};
