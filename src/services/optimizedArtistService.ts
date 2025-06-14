
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
      console.warn('Invalid artist ID provided:', id);
      return null;
    }
    
    // First try to get from artist_details
    const { data: artist, error } = await supabase
      .from('artist_details')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Database error fetching from artist_details:', error);
      
      // Fallback to profiles table
      console.log('Falling back to profiles table...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) {
        console.error('Database error fetching from profiles:', profileError);
        return null;
      }

      if (!profileData) {
        console.log(`No profile found for user ID: ${id}`);
        return null;
      }

      // Convert profile data to artist format
      return {
        ...profileData,
        special_skills: [],
        projects: [],
        education_training: [],
        media_assets: [],
        language_skills: [],
        tools_software: [],
        skills: []
      };
    }

    if (!artist) {
      console.log(`No artist found with ID: ${id}, checking profiles table...`);
      
      // Fallback to profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) {
        console.error('Database error fetching from profiles:', profileError);
        return null;
      }

      if (!profileData) {
        console.log(`No profile found for user ID: ${id}`);
        return null;
      }

      console.log(`Found profile data for user: ${profileData.full_name}`);

      // Convert profile data to artist format with safe defaults
      return {
        ...profileData,
        special_skills: [],
        projects: [],
        education_training: [],
        media_assets: [],
        language_skills: [],
        tools_software: [],
        skills: []
      };
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
    // Don't throw error, return null to let the UI handle gracefully
    return null;
  }
};
