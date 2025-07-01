
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Artist, ArtistCategory, ExperienceLevel } from "@/types/artist";
import { cacheManager } from "@/utils/cacheManager";

export const useArtistProfile = (artistId: string | undefined, options = {}) => {
  return useQuery({
    queryKey: ['artist-profile', artistId],
    queryFn: async (): Promise<Artist> => {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }

      console.log('Fetching artist profile for ID:', artistId);

      // Check session validity
      if (!cacheManager.isSessionValid()) {
        console.warn('Session may be invalid for profile fetch');
      }

      try {
        // First, get the basic profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *
          `)
          .eq('id', artistId)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        if (!profile) {
          console.log('No profile found for ID:', artistId);
          throw new Error('Artist not found');
        }

        console.log('Profile fetched successfully:', profile);

        // Then fetch related data in parallel
        const [
          { data: projects },
          { data: education },
          { data: skills },
          { data: languages },
          { data: tools },
          { data: references },
          { data: mediaAssets }
        ] = await Promise.all([
          supabase.from('projects').select('*').eq('artist_id', artistId),
          supabase.from('education_training').select('*').eq('artist_id', artistId),
          supabase.from('special_skills').select('*').eq('artist_id', artistId),
          supabase.from('language_skills').select('*').eq('artist_id', artistId),
          supabase.from('tools_software').select('*').eq('artist_id', artistId),
          supabase.from('professional_references').select('*').eq('artist_id', artistId),
          supabase.from('media_assets').select('*').eq('artist_id', artistId)
        ]);

        // Map skills to the skills array format expected by the frontend
        const skillsArray = skills?.map(skill => skill.skill) || [];

        const artistData: Artist = {
          ...profile,
          category: profile.category as ArtistCategory,
          experience_level: profile.experience_level as ExperienceLevel,
          skills: skillsArray,
          projects: projects || [],
          education_training: education || [],
          special_skills: skills || [],
          language_skills: languages || [],
          tools_software: tools || [],
          professional_references: references || [],
          media_assets: mediaAssets || []
        };

        console.log('Complete artist data assembled:', artistData);
        return artistData;

      } catch (error: any) {
        console.error('Error in useArtistProfile:', error);
        throw error;
      }
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes - reasonable caching
    refetchOnMount: false, // Don't always refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found') || error?.message?.includes('Artist not found')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options
  });
};
