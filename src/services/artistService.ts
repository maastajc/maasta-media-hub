import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log('Fetching all artists...');
    
    const { data: artists, error } = await supabase
      .from('unified_profiles')
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
        // Map related data with proper fallbacks and type checking
        special_skills: Array.isArray(artist.special_skills) 
          ? artist.special_skills.map(skill => ({
              id: skill.id,
              skill: skill.skill,
              artist_id: artist.id
            }))
          : [],
        projects: Array.isArray(artist.projects) 
          ? artist.projects.map(project => ({
              id: project.id,
              project_name: project.project_name,
              role_in_project: project.role_in_project,
              project_type: project.project_type,
              year_of_release: project.year_of_release,
              artist_id: artist.id
            }))
          : [],
        education_training: Array.isArray(artist.education_training) 
          ? artist.education_training.map(edu => ({
              id: edu.id,
              qualification_name: edu.qualification_name,
              institution: edu.institution,
              year_completed: edu.year_completed,
              is_academic: edu.is_academic,
              artist_id: artist.id
            }))
          : [],
        language_skills: Array.isArray(artist.language_skills) 
          ? artist.language_skills.map(lang => ({
              id: lang.id,
              language: lang.language,
              proficiency: lang.proficiency,
              artist_id: artist.id
            }))
          : [],
        media_assets: Array.isArray(artist.media_assets) 
          ? artist.media_assets.map(media => ({
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
          : []
      } as Artist;
    }).filter(Boolean) as Artist[];
  } catch (error: any) {
    console.error('Error in fetchAllArtists:', error);
    throw error;
  }
};

export const fetchArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    console.log('fetchArtistById called with ID:', artistId);
    
    if (!artistId) {
      throw new Error('Artist ID is required');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(artistId)) {
      console.error('Invalid UUID format:', artistId);
      throw new Error(`Invalid artist ID format: ${artistId}`);
    }

    console.log('Making Supabase query for artist:', artistId);

    const { data: artist, error } = await supabase
      .from('unified_profiles')
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

    console.log('Supabase query completed:', { data: !!artist, error });

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!artist) {
      console.log('No artist found for ID:', artistId);
      throw new Error('Artist not found');
    }

    console.log('Successfully fetched artist:', {
      id: artist.id,
      name: artist.full_name,
      status: artist.status
    });
    
    // Return artist with proper fallbacks for all nested data and type checking
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
      special_skills: Array.isArray(artist.special_skills) 
        ? artist.special_skills.map(skill => ({
            id: skill.id,
            skill: skill.skill,
            artist_id: artist.id
          }))
        : [],
      projects: Array.isArray(artist.projects) 
        ? artist.projects.map(project => ({
            id: project.id,
            project_name: project.project_name,
            role_in_project: project.role_in_project,
            project_type: project.project_type,
            year_of_release: project.year_of_release,
            director_producer: project.director_producer,
            streaming_platform: project.streaming_platform,
            link: project.link,
            artist_id: artist.id
          }))
        : [],
      education_training: Array.isArray(artist.education_training) 
        ? artist.education_training.map(edu => ({
            id: edu.id,
            qualification_name: edu.qualification_name,
            institution: edu.institution,
            year_completed: edu.year_completed,
            is_academic: edu.is_academic,
            artist_id: artist.id
          }))
        : [],
      language_skills: Array.isArray(artist.language_skills) 
        ? artist.language_skills.map(lang => ({
            id: lang.id,
            language: lang.language,
            proficiency: lang.proficiency,
            artist_id: artist.id
          }))
        : [],
      tools_software: Array.isArray(artist.tools_software) 
        ? artist.tools_software.map(tool => ({
            id: tool.id,
            tool_name: tool.tool_name,
            artist_id: artist.id
          }))
        : [],
      media_assets: Array.isArray(artist.media_assets) 
        ? artist.media_assets.map(media => ({
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
        : []
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

    // Extract only the fields that belong to unified_profiles table
    const {
      special_skills,
      projects,
      education_training,
      language_skills,
      tools_software,
      media_assets,
      professional_references,
      ...unifiedProfileData
    } = profileData;

    // Validate the data before updating
    const validateProfileData = (data: any) => {
      const errors: string[] = [];
      
      if (data.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
        errors.push('Invalid email format');
      }
      
      if (data.phone_number && !/^\+?[\d\s\-\(\)\.]{10,}$/.test(data.phone_number)) {
        errors.push('Invalid phone number format');
      }
      
      if (data.date_of_birth && new Date(data.date_of_birth) > new Date()) {
        errors.push('Date of birth cannot be in the future');
      }
      
      if (data.years_of_experience !== undefined && (data.years_of_experience < 0 || data.years_of_experience > 100)) {
        errors.push('Years of experience must be between 0 and 100');
      }
      
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }
      
      return data;
    };

    const validatedData = validateProfileData(unifiedProfileData);

    const updateData = {
      ...validatedData,
      updated_at: new Date().toISOString()
    };

    const { data: updatedArtist, error } = await supabase
      .from('unified_profiles')
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
      .from('unified_profiles')
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
