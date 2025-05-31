
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    const { data: artists, error } = await supabase
      .from('artist_details')
      .select(`
        id,
        full_name,
        bio,
        profile_picture_url,
        city,
        state,
        country,
        category,
        experience_level,
        verified,
        special_skills!fk_special_skills_artist_details (skill)
      `)
      .eq('status', 'active')
      .not('profile_picture_url', 'is', null)
      .limit(limit);

    if (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }

    return artists.map(artist => ({
      ...artist,
      skills: artist.special_skills?.map((s: any) => s.skill) || []
    })) || [];
  } catch (error) {
    console.error('Error in fetchFeaturedArtists:', error);
    return [];
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    const { data: artist, error } = await supabase
      .from('artist_details')
      .select(`
        *,
        special_skills!fk_special_skills_artist_details (skill),
        projects!fk_projects_artist_details (*),
        education_training!fk_education_training_artist_details (*),
        media_assets!fk_media_assets_artist_details (*)
      `)
      .eq('id', id)
      .single();

    if (error || !artist) {
      console.error('Error fetching artist:', error);
      return null;
    }

    return {
      ...artist,
      skills: artist.special_skills?.map((s: any) => s.skill) || []
    };
  } catch (error) {
    console.error('Error in fetchArtistById:', error);
    return null;
  }
};
