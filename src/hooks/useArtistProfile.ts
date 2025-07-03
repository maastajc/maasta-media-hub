
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Artist, ArtistCategory, ExperienceLevel, CustomLink } from "@/types/artist";
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

        // Map database data to Artist type format
        const mappedProjects = (projects || []).map(p => ({
          ...p,
          user_id: p.artist_id
        }));

        const mappedEducation = (education || []).map(e => ({
          ...e,
          user_id: e.artist_id
        }));

        const mappedSkills = (skills || []).map(s => ({
          ...s,
          skill_name: s.skill,
          user_id: s.artist_id
        }));

        const mappedLanguages = (languages || []).map(l => ({
          ...l,
          language_name: l.language,
          user_id: l.artist_id
        }));

        const mappedTools = (tools || []).map(t => ({
          ...t,
          user_id: t.artist_id
        }));

        const mappedReferences = (references || []).map(r => ({
          ...r,
          reference_name: r.name,
          reference_title: r.role,
          reference_company: '',
          user_id: r.artist_id
        }));

        const mappedMediaAssets = (mediaAssets || []).map(m => ({
          ...m,
          asset_type: m.file_type,
          asset_url: m.url
        }));

        const mappedAwards = (awards || []).map(a => ({
          ...a,
          award_name: a.title,
          awarding_organization: a.organization,
          user_id: a.artist_id
        }));

        // Create skills array for backward compatibility
        const skillsArray = mappedSkills.map(s => s.skill_name);

        const artistData: Artist = {
          ...profile,
          category: (profile.category as ArtistCategory) || 'actor',
          experience_level: (profile.experience_level as ExperienceLevel) || 'beginner',
          custom_links: customLinksArray,
          projects: mappedProjects,
          education: mappedEducation,
          education_training: mappedEducation,
          special_skills: mappedSkills,
          language_skills: mappedLanguages,
          tools_software: mappedTools,
          professional_references: mappedReferences,
          media_assets: mappedMediaAssets,
          awards: mappedAwards,
          skills: skillsArray
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
