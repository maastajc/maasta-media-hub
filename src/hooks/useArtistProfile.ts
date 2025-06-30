
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchArtistById, updateArtistProfile } from '@/services/artistService';
import { Artist } from '@/types/artist';
import { toast } from 'sonner';
import { cacheManager } from '@/utils/cacheManager';

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
    staleTime = 0 // Always fetch fresh data
  } = options;
  
  const profileQuery = useQuery({
    queryKey: ['artistProfile', targetId, Date.now()], // Always use fresh timestamp
    queryFn: async () => {
      if (!targetId) {
        throw new Error('No artist ID provided');
      }
      
      console.log('Fetching fresh artist profile for ID:', targetId);
      
      // Clear cache before fetching
      cacheManager.forceClearCache('profile');
      
      const profile = await fetchArtistById(targetId);
      
      if (!profile) {
        throw new Error(`Artist profile not found for ID: ${targetId}`);
      }
      
      return profile;
    },
    enabled: !!targetId && enabled,
    staleTime: 0, // Never use stale data
    refetchOnWindowFocus: true, // Always refetch on focus
    retry: 2,
    retryDelay: 500,
    gcTime: 0, // Don't cache the data
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<Artist>) => {
      if (!user?.id) {
        throw new Error('User must be authenticated to update profile');
      }
      
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('No profile data provided for update');
      }
      
      const result = await updateArtistProfile(user.id, profileData);
      
      if (!result) {
        throw new Error('Profile update failed');
      }
      
      return result;
    },
    onSuccess: (updatedProfile) => {
      // Clear all cache and invalidate queries
      cacheManager.bustCache();
      queryClient.clear(); // Clear all query cache
      queryClient.invalidateQueries({ queryKey: ['artistProfile'] });
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
      console.log('Force refreshing profile data...');
      cacheManager.bustCache();
      queryClient.clear();
      const result = await profileQuery.refetch();
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
