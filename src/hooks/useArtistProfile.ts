
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useArtistProfile = (artistId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use provided artistId or fallback to current user's id
  const targetId = artistId || user?.id;
  
  const fetchArtistProfile = async () => {
    if (!targetId) return null;
    
    console.log("Fetching artist profile for ID:", targetId);
    
    // Get the main artist details
    const { data: artistDetails, error: artistError } = await supabase
      .from('artist_details')
      .select('*')
      .eq('id', targetId)
      .single();
    
    if (artistError) {
      console.error("Artist details error:", artistError);
      throw artistError;
    }

    // Get related data
    const [
      { data: projects },
      { data: education },
      { data: specialSkills },
      { data: languageSkills },
      { data: toolsSoftware },
      { data: mediaAssets }
    ] = await Promise.all([
      supabase.from("projects").select("*").eq("artist_id", targetId),
      supabase.from("education_training").select("*").eq("artist_id", targetId),
      supabase.from("special_skills").select("*").eq("artist_id", targetId),
      supabase.from("language_skills").select("*").eq("artist_id", targetId),
      supabase.from("tools_software").select("*").eq("artist_id", targetId),
      supabase.from("media_assets").select("*").eq("artist_id", targetId)
    ]);

    // Combine all data into a unified profile structure
    const profileData = {
      ...artistDetails,
      projects: projects || [],
      education_training: education || [],
      special_skills: specialSkills || [],
      language_skills: languageSkills || [],
      tools_software: toolsSoftware || [],
      media_assets: mediaAssets || []
    };

    console.log("Combined artist profile data:", profileData);
    return profileData;
  };
  
  const updateArtistProfile = async (profileData: any) => {
    if (!user) throw new Error('No authenticated user');
    
    const { data, error } = await supabase
      .from('artist_details')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };
  
  const profileQuery = useQuery({
    queryKey: ['artistProfile', targetId],
    queryFn: fetchArtistProfile,
    enabled: !!targetId,
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: updateArtistProfile,
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
