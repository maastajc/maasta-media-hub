
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    // Simplified query with shorter timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Featured artists fetch timeout')), 5000)
    );

    const fetchPromise = supabase
      .from('unified_profiles')
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
        verified
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
    
    // Return simplified artist data without complex joins
    return artists.map((artist: any) => ({
      ...artist,
      skills: [] // We'll load skills separately if needed
    }));
  } catch (error) {
    console.error('Error in fetchFeaturedArtists:', error);
    return [];
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    // Shorter timeout for single artist fetch
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Artist fetch timeout')), 8000)
    );

    const fetchPromise = supabase
      .from('unified_profiles')
      .select('*')
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

    return {
      ...artist,
      skills: [] // Simplified for now
    };
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    
    if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};
