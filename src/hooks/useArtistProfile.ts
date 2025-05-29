
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchArtistById, updateArtistProfile } from '@/services/artistService';
import { Artist } from '@/types/artist';

export const useArtistProfile = (artistId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use provided artistId or fallback to current user's id
  const targetId = artistId || user?.id;
  
  const profileQuery = useQuery({
    queryKey: ['artistProfile', targetId],
    queryFn: () => fetchArtistById(targetId!),
    enabled: !!targetId,
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<Artist>) => updateArtistProfile(user!.id, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', targetId] });
    },
  });
  
  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    refetch: profileQuery.refetch,
  };
};
