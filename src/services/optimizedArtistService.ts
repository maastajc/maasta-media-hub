
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    // Reduced timeout and better error handling
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please check your connection')), 8000)
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
      console.error('Database error fetching featured artists:', error);
      return [];
    }

    if (!artists || artists.length === 0) {
      console.log('No featured artists found');
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
    console.error('Error in fetchFeaturedArtists:', error);
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
      setTimeout(() => reject(new Error('Profile loading timeout - please try again')), 10000)
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
    console.error('Error in fetchArtistById:', error);
    throw error;
  }
};
