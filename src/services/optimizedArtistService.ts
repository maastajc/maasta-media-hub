
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Featured artists fetch timeout')), 8000)
    );

    const fetchPromise = supabase
      .from('artist_details')
      .select(`
        id,
        full_name,
        email,
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

    const { data: artists, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }

    if (!artists) {
      console.log('No featured artists found');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} featured artists`);
    
    return artists.map((artist: any) => {
      const { special_skills, ...artistData } = artist;
      return {
        ...artistData,
        skills: special_skills?.map((s: any) => s.skill) || []
      };
    });
  } catch (error) {
    console.error('Error in fetchFeaturedArtists:', error);
    return [];
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Artist fetch timeout')), 10000)
    );

    const fetchPromise = supabase
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

    const { data: artist, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Error fetching artist:', error);
      
      if (error.code === 'PGRST116') {
        throw new Error('Artist not found');
      }
      
      throw new Error(error.message || 'Failed to fetch artist');
    }

    if (!artist) {
      throw new Error('Artist not found');
    }

    console.log(`Successfully fetched artist: ${artist.full_name}`);

    const { special_skills, ...artistData } = artist;
    return {
      ...artistData,
      skills: special_skills?.map((s: any) => s.skill) || []
    };
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    
    if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};
