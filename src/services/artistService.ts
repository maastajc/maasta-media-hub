
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log('Fetching all artists...');
    
    const { data: artists, error } = await supabase
      .from('artist_details')
      .select(`
        *,
        special_skills (
          id,
          skill
        ),
        projects (
          id,
          project_name,
          role_in_project,
          project_type,
          year_of_release
        ),
        education_training (
          id,
          qualification_name,
          institution,
          year_completed,
          is_academic
        ),
        language_skills (
          id,
          language,
          proficiency
        ),
        media_assets (
          id,
          url,
          file_name,
          file_type,
          file_size,
          is_video,
          description,
          user_id
        )
      `)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching artists:', error);
      throw new Error(`Failed to fetch artists: ${error.message}`);
    }

    if (!artists || artists.length === 0) {
      console.log('No artists found');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} artists`);
    return artists.map(artist => ({
      ...artist,
      // Map related data and add missing artist_id fields
      special_skills: (artist.special_skills || []).map(skill => ({
        ...skill,
        artist_id: artist.id
      })),
      projects: (artist.projects || []).map(project => ({
        ...project,
        artist_id: artist.id
      })),
      education_training: (artist.education_training || []).map(edu => ({
        ...edu,
        artist_id: artist.id
      })),
      language_skills: (artist.language_skills || []).map(lang => ({
        ...lang,
        artist_id: artist.id
      })),
      media_assets: (artist.media_assets || []).map(media => ({
        ...media,
        artist_id: artist.id,
        user_id: media.user_id || artist.id,
        file_size: media.file_size || 0
      })),
      // Ensure required fields have fallbacks
      full_name: artist.full_name || 'Unknown Artist',
      email: artist.email || '',
      category: artist.category || 'actor',
      experience_level: artist.experience_level || 'beginner'
    }));
  } catch (error: any) {
    console.error('Error in fetchAllArtists:', error);
    throw error;
  }
};

export const fetchArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', artistId);
    
    if (!artistId) {
      throw new Error('Artist ID is required');
    }

    const { data: artist, error } = await supabase
      .from('artist_details')
      .select(`
        *,
        special_skills (
          id,
          skill
        ),
        projects (
          id,
          project_name,
          role_in_project,
          project_type,
          year_of_release,
          director_producer,
          streaming_platform,
          link
        ),
        education_training (
          id,
          qualification_name,
          institution,
          year_completed,
          is_academic
        ),
        language_skills (
          id,
          language,
          proficiency
        ),
        tools_software (
          id,
          tool_name
        ),
        media_assets (
          id,
          url,
          file_name,
          file_type,
          file_size,
          is_video,
          is_embed,
          embed_source,
          description,
          user_id
        )
      `)
      .eq('id', artistId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching artist:', error);
      throw new Error(`Failed to fetch artist: ${error.message}`);
    }

    if (!artist) {
      console.log('Artist not found:', artistId);
      return null;
    }

    console.log('Successfully fetched artist:', artist.full_name);
    
    // Return artist with proper fallbacks for all nested data and add missing artist_id fields
    return {
      ...artist,
      special_skills: (artist.special_skills || []).map(skill => ({
        ...skill,
        artist_id: artist.id
      })),
      projects: (artist.projects || []).map(project => ({
        ...project,
        artist_id: artist.id
      })),
      education_training: (artist.education_training || []).map(edu => ({
        ...edu,
        artist_id: artist.id
      })),
      language_skills: (artist.language_skills || []).map(lang => ({
        ...lang,
        artist_id: artist.id
      })),
      tools_software: (artist.tools_software || []).map(tool => ({
        ...tool,
        artist_id: artist.id
      })),
      media_assets: (artist.media_assets || []).map(media => ({
        ...media,
        artist_id: artist.id,
        user_id: media.user_id || artist.id,
        file_size: media.file_size || 0
      })),
      // Ensure required fields have fallbacks
      full_name: artist.full_name || 'Unknown Artist',
      email: artist.email || '',
      category: artist.category || 'actor',
      experience_level: artist.experience_level || 'beginner'
    };
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    throw error;
  }
};

export const updateArtistProfile = async (
  artistId: string, 
  profileData: Partial<Artist>
): Promise<Artist | null> => {
  try {
    console.log('Updating artist profile:', artistId, profileData);
    
    if (!artistId) {
      throw new Error('Artist ID is required');
    }

    if (!profileData || Object.keys(profileData).length === 0) {
      throw new Error('Profile data is required');
    }

    // Extract only the fields that belong to artist_details table
    const {
      special_skills,
      projects,
      education_training,
      language_skills,
      tools_software,
      media_assets,
      ...artistDetailsData
    } = profileData;

    // Ensure category is properly typed and remove any non-database fields
    const updateData = {
      ...artistDetailsData,
      // Ensure category is properly cast to the expected type
      category: artistDetailsData.category as "actor" | "director" | "cinematographer" | "musician" | "editor" | "art_director" | "stunt_coordinator" | "producer" | "writer" | "other" | undefined,
      updated_at: new Date().toISOString()
    };

    const { data: updatedArtist, error } = await supabase
      .from('artist_details')
      .update(updateData)
      .eq('id', artistId)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    if (!updatedArtist) {
      throw new Error('No data returned after update');
    }

    console.log('Successfully updated artist profile');
    
    // Fetch the complete updated profile with all related data
    return await fetchArtistById(artistId);
  } catch (error: any) {
    console.error('Error in updateArtistProfile:', error);
    throw error;
  }
};

// Helper function to check if an artist profile exists
export const checkArtistExists = async (artistId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('artist_details')
      .select('id')
      .eq('id', artistId)
      .maybeSingle();

    if (error) {
      console.error('Error checking artist existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkArtistExists:', error);
    return false;
  }
};
