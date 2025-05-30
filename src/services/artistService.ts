
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log('Fetching all artists...');
    
    const { data: artists, error } = await supabase
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
          year_of_release
        ),
        education_training!fk_education_training_artist_details (
          id,
          qualification_name,
          institution,
          year_completed,
          is_academic
        ),
        language_skills!fk_language_skills_artist_details (
          id,
          language,
          proficiency
        ),
        media_assets!fk_media_assets_artist_details (
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
    return artists.map(artist => {
      if (!artist) return null;
      
      return {
        id: artist.id,
        full_name: artist.full_name || 'Unknown Artist',
        email: artist.email || '',
        bio: artist.bio,
        profile_picture_url: artist.profile_picture_url,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        phone_number: artist.phone_number,
        date_of_birth: artist.date_of_birth,
        gender: artist.gender,
        instagram: artist.instagram,
        linkedin: artist.linkedin,
        youtube_vimeo: artist.youtube_vimeo,
        personal_website: artist.personal_website,
        category: artist.category || 'actor',
        experience_level: artist.experience_level || 'beginner',
        years_of_experience: artist.years_of_experience,
        role: artist.role,
        verified: artist.verified || false,
        status: artist.status,
        work_preference: artist.work_preference,
        willing_to_relocate: artist.willing_to_relocate,
        imdb_profile: artist.imdb_profile,
        association_membership: artist.association_membership,
        rate_card: artist.rate_card,
        created_at: artist.created_at,
        updated_at: artist.updated_at,
        // Map related data and add missing artist_id fields
        special_skills: (artist.special_skills || []).map(skill => ({
          id: skill.id,
          skill: skill.skill,
          artist_id: artist.id
        })),
        projects: (artist.projects || []).map(project => ({
          id: project.id,
          project_name: project.project_name,
          role_in_project: project.role_in_project,
          project_type: project.project_type,
          year_of_release: project.year_of_release,
          artist_id: artist.id
        })),
        education_training: (artist.education_training || []).map(edu => ({
          id: edu.id,
          qualification_name: edu.qualification_name,
          institution: edu.institution,
          year_completed: edu.year_completed,
          is_academic: edu.is_academic,
          artist_id: artist.id
        })),
        language_skills: (artist.language_skills || []).map(lang => ({
          id: lang.id,
          language: lang.language,
          proficiency: lang.proficiency,
          artist_id: artist.id
        })),
        media_assets: (artist.media_assets || []).map(media => ({
          id: media.id,
          url: media.url,
          file_name: media.file_name,
          file_type: media.file_type,
          file_size: media.file_size || 0,
          is_video: media.is_video,
          description: media.description,
          user_id: media.user_id || artist.id,
          artist_id: artist.id
        }))
      } as Artist;
    }).filter(Boolean) as Artist[];
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
        language_skills!fk_language_skills_artist_details (
          id,
          language,
          proficiency
        ),
        tools_software!fk_tools_software_artist_details (
          id,
          tool_name
        ),
        media_assets!fk_media_assets_artist_details (
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
      id: artist.id,
      full_name: artist.full_name || 'Unknown Artist',
      email: artist.email || '',
      bio: artist.bio,
      profile_picture_url: artist.profile_picture_url,
      city: artist.city,
      state: artist.state,
      country: artist.country,
      phone_number: artist.phone_number,
      date_of_birth: artist.date_of_birth,
      gender: artist.gender,
      instagram: artist.instagram,
      linkedin: artist.linkedin,
      youtube_vimeo: artist.youtube_vimeo,
      personal_website: artist.personal_website,
      category: artist.category || 'actor',
      experience_level: artist.experience_level || 'beginner',
      years_of_experience: artist.years_of_experience,
      role: artist.role,
      verified: artist.verified || false,
      status: artist.status,
      work_preference: artist.work_preference,
      willing_to_relocate: artist.willing_to_relocate,
      imdb_profile: artist.imdb_profile,
      association_membership: artist.association_membership,
      rate_card: artist.rate_card,
      created_at: artist.created_at,
      updated_at: artist.updated_at,
      special_skills: (artist.special_skills || []).map(skill => ({
        id: skill.id,
        skill: skill.skill,
        artist_id: artist.id
      })),
      projects: (artist.projects || []).map(project => ({
        id: project.id,
        project_name: project.project_name,
        role_in_project: project.role_in_project,
        project_type: project.project_type,
        year_of_release: project.year_of_release,
        director_producer: project.director_producer,
        streaming_platform: project.streaming_platform,
        link: project.link,
        artist_id: artist.id
      })),
      education_training: (artist.education_training || []).map(edu => ({
        id: edu.id,
        qualification_name: edu.qualification_name,
        institution: edu.institution,
        year_completed: edu.year_completed,
        is_academic: edu.is_academic,
        artist_id: artist.id
      })),
      language_skills: (artist.language_skills || []).map(lang => ({
        id: lang.id,
        language: lang.language,
        proficiency: lang.proficiency,
        artist_id: artist.id
      })),
      tools_software: (artist.tools_software || []).map(tool => ({
        id: tool.id,
        tool_name: tool.tool_name,
        artist_id: artist.id
      })),
      media_assets: (artist.media_assets || []).map(media => ({
        id: media.id,
        url: media.url,
        file_name: media.file_name,
        file_type: media.file_type,
        file_size: media.file_size || 0,
        is_video: media.is_video,
        is_embed: media.is_embed,
        embed_source: media.embed_source,
        description: media.description,
        user_id: media.user_id || artist.id,
        artist_id: artist.id
      }))
    } as Artist;
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
      professional_references,
      ...artistDetailsData
    } = profileData;

    // Ensure category and experience_level are properly typed and remove any non-database fields
    const updateData = {
      ...artistDetailsData,
      // Ensure category is properly cast to the expected type
      category: artistDetailsData.category as "actor" | "director" | "cinematographer" | "musician" | "editor" | "art_director" | "stunt_coordinator" | "producer" | "writer" | "other" | undefined,
      // Ensure experience_level is properly cast to the expected type
      experience_level: artistDetailsData.experience_level as "beginner" | "fresher" | "intermediate" | "expert" | "veteran" | undefined,
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
