
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";
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
          { data: mediaAssets },
          { data: awards }
        ] = await Promise.all([
          supabase.from('projects').select('*').eq('artist_id', artistId),
          supabase.from('education_training').select('*').eq('artist_id', artistId),
          supabase.from('special_skills').select('*').eq('artist_id', artistId),
          supabase.from('language_skills').select('*').eq('artist_id', artistId),
          supabase.from('tools_software').select('*').eq('artist_id', artistId),
          supabase.from('professional_references').select('*').eq('artist_id', artistId),
          supabase.from('media_assets').select('*').eq('artist_id', artistId),
          supabase.from('awards').select('*').eq('artist_id', artistId)
        ]);

        // Parse custom_links from JSON
        let customLinksArray = [];
        if (profile.custom_links) {
          try {
            const parsedLinks = typeof profile.custom_links === 'string' 
              ? JSON.parse(profile.custom_links) 
              : profile.custom_links;
            
            if (Array.isArray(parsedLinks)) {
              customLinksArray = parsedLinks.map((link: any, index: number) => ({
                id: link.id || `custom-${index}`,
                title: link.title || '',
                url: link.url || ''
              }));
            }
          } catch (e) {
            console.error('Error parsing custom_links:', e);
          }
        }

        const artistData: Artist = {
          ...profile,
          custom_links: customLinksArray,
          projects: projects || [],
          education: education || [],
          education_training: education || [],
          special_skills: skills || [],
          language_skills: languages || [],
          tools_software: tools || [],
          professional_references: references || [],
          media_assets: mediaAssets || [],
          awards: awards || []
        };

        console.log('Complete artist data assembled:', artistData);
        return artistData;

      } catch (error: any) {
        console.error('Error in useArtistProfile:', error);
        throw error;
      }
    },
    enabled: !!artistId,
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute for more frequent updates
    refetchOnMount: false,
    refetchOnWindowFocus: true, // Enable refetch on window focus to catch updates
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
