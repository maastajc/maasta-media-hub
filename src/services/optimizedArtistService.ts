
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log(`Fetching ${limit} featured artists...`);
    
    // Reduced timeout for faster failure
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout - please try again')), 5000)
    );

    // Simplified query for better performance
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
        verified
      `)
      .eq('status', 'active')
      .not('full_name', 'eq', 'New User')
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data: artists, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Database error fetching featured artists:', error);
      throw new Error(`Failed to load artists: ${error.message}`);
    }

    if (!artists) {
      console.log('No featured artists found');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} featured artists`);
    
    // Fetch skills separately for better performance
    const artistsWithSkills = await Promise.all(
      artists.map(async (artist: any) => {
        try {
          const { data: skills } = await supabase
            .from('special_skills')
            .select('skill')
            .eq('artist_id', artist.id)
            .limit(5); // Limit skills for performance

          return {
            ...artist,
            special_skills: skills || [],
            skills: skills?.map((s: any) => s.skill) || []
          };
        } catch (error) {
          console.warn(`Failed to fetch skills for artist ${artist.id}:`, error);
          return {
            ...artist,
            special_skills: [],
            skills: []
          };
        }
      })
    );

    return artistsWithSkills;
  } catch (error: any) {
    console.error('Error in fetchFeaturedArtists:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid artist ID provided');
    }
    
    // Reduced timeout for profile queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile loading timeout - please try again')), 8000)
    );

    const fetchPromise = supabase
      .from('artist_details')
      .select('*')
      .eq('id', id)
      .single();

    const { data: artist, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Database error fetching artist:', error);
      
      if (error.code === 'PGRST116') {
        throw new Error(`Artist not found with ID: ${id}`);
      }
      
      throw new Error(`Failed to load profile: ${error.message}`);
    }

    if (!artist) {
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artist.full_name}`);

    // Fetch related data separately for better performance
    const [skillsData, projectsData, educationData, mediaData] = await Promise.allSettled([
      supabase.from('special_skills').select('*').eq('artist_id', id),
      supabase.from('projects').select('*').eq('artist_id', id),
      supabase.from('education_training').select('*').eq('artist_id', id),
      supabase.from('media_assets').select('*').eq('artist_id', id)
    ]);

    // Transform data with safe defaults
    return {
      ...artist,
      special_skills: skillsData.status === 'fulfilled' ? skillsData.value.data || [] : [],
      projects: projectsData.status === 'fulfilled' ? projectsData.value.data || [] : [],
      education_training: educationData.status === 'fulfilled' ? educationData.value.data || [] : [],
      media_assets: mediaData.status === 'fulfilled' ? mediaData.value.data || [] : [],
      language_skills: [],
      tools_software: [],
      skills: skillsData.status === 'fulfilled' ? 
        (skillsData.value.data || []).map((s: any) => s.skill) : []
    };
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    throw error;
  }
};
