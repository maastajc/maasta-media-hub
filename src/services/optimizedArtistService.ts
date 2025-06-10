
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    // Increase timeout and add more specific error handling
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Featured artists fetch timeout - server may be overloaded')), 15000)
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
      console.error('Supabase error fetching featured artists:', error);
      // Return empty array instead of crashing
      return [];
    }

    if (!artists || artists.length === 0) {
      console.log('No featured artists found in database');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} featured artists`);
    
    return artists.map((artist: any) => {
      const { special_skills, ...artistData } = artist;
      return {
        ...artistData,
        special_skills: special_skills || [],
        skills: special_skills?.map((s: any) => s.skill) || []
      };
    });
  } catch (error: any) {
    console.error('Critical error in fetchFeaturedArtists:', error);
    // Always return empty array to prevent crashes
    return [];
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid artist ID provided');
    }
    
    // Increase timeout for detailed profile queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Artist profile fetch timeout - this may indicate server issues')), 20000)
    );

    const fetchPromise = supabase
      .from('artist_details')
      .select(`
        *,
        special_skills!fk_special_skills_artist_details (
          id,
          skill
        ),
        projects!fk_projects_artist_details (
          id,
          project_name,
          role_in_project,
          project_type,
          year_of_release,
          director_producer,
          streaming_platform,
          link
        ),
        education_training!fk_education_training_artist_details (
          id,
          qualification_name,
          institution,
          year_completed,
          is_academic
        ),
        media_assets!fk_media_assets_artist_details (
          id,
          url,
          file_name,
          file_type,
          description,
          is_video,
          is_embed,
          embed_source
        ),
        language_skills (
          id,
          language,
          proficiency
        ),
        tools_software (
          id,
          tool_name
        )
      `)
      .eq('id', id)
      .single();

    const { data: artist, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Supabase error fetching artist:', error);
      
      if (error.code === 'PGRST116') {
        throw new Error(`Artist not found with ID: ${id}`);
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    if (!artist) {
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artist.full_name}`);

    // Transform data with safe defaults
    const { special_skills, language_skills, tools_software, ...artistData } = artist;
    return {
      ...artistData,
      special_skills: special_skills || [],
      language_skills: language_skills || [],
      tools_software: tools_software || [],
      projects: artistData.projects || [],
      education_training: artistData.education_training || [],
      media_assets: artistData.media_assets || [],
      skills: special_skills?.map((s: any) => s.skill) || []
    };
  } catch (error: any) {
    console.error('Critical error in fetchArtistById:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    if (error.message?.includes('not found')) {
      throw new Error(`Artist profile not found. The artist may have been removed or the link is incorrect.`);
    }
    
    throw error;
  }
};
