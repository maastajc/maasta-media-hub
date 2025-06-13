import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

// Create a type that matches Supabase's expected update format
type ArtistUpdateData = {
  association_membership?: string;
  bio?: string;
  category?: "actor" | "director" | "cinematographer" | "musician" | "editor" | "art_director" | "stunt_coordinator" | "producer" | "writer" | "other";
  city?: string;
  country?: string;
  date_of_birth?: string;
  email?: string;
  experience_level?: "beginner" | "fresher" | "intermediate" | "expert" | "veteran";
  full_name?: string;
  gender?: string;
  imdb_profile?: string;
  instagram?: string;
  linkedin?: string;
  personal_website?: string;
  phone_number?: string;
  profile_picture_url?: string;
  role?: string;
  state?: string;
  status?: string;
  verified?: boolean;
  willing_to_relocate?: boolean;
  work_preference?: string;
  years_of_experience?: number;
  youtube_vimeo?: string;
};

// Helper function to convert Artist data to database update format
const convertToUpdateData = (profileData: Partial<Artist>) => {
  // Create a clean object with only the fields that can be updated
  const updateData: any = {};
  
  const allowedFields = [
    'association_membership', 'bio', 'category', 'city', 'country', 
    'date_of_birth', 'email', 'experience_level', 'full_name', 
    'gender', 'imdb_profile', 'instagram', 'linkedin', 
    'personal_website', 'phone_number', 'profile_picture_url', 
    'role', 'state', 'status', 'verified', 'willing_to_relocate', 
    'work_preference', 'years_of_experience', 'youtube_vimeo'
  ];
  
  allowedFields.forEach(field => {
    if (profileData[field as keyof Artist] !== undefined) {
      updateData[field] = profileData[field as keyof Artist];
    }
  });
  
  return updateData;
};

export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log('Fetching all artists...');
    
    // Increased timeout for better reliability
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Artists fetch timeout - please try refreshing')), 15000)
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
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: artists, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Database error fetching all artists:', error);
      throw new Error(`Failed to fetch artists: ${error.message}`);
    }

    if (!artists || artists.length === 0) {
      console.log('No artists found');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} artists`);
    
    return artists.map((artist: any) => {
      const { special_skills, ...artistData } = artist;
      return {
        ...artistData,
        special_skills: special_skills || [],
        skills: special_skills?.map((s: any) => s.skill) || []
      };
    });
  } catch (error: any) {
    console.error('Error in fetchAllArtists:', error);
    throw error;
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid artist ID provided');
    }
    
    // Increased timeout for profile queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile loading timeout - please try again')), 15000)
    );

    const fetchPromise = supabase
      .from('artist_details')
      .select(`
        *,
        special_skills!special_skills_artist_id_fkey (
          id,
          skill
        ),
        projects!projects_artist_id_fkey (
          id,
          project_name,
          role_in_project,
          project_type,
          year_of_release,
          director_producer,
          streaming_platform,
          link
        ),
        education_training!education_training_artist_id_fkey (
          id,
          qualification_name,
          institution,
          year_completed,
          is_academic
        ),
        media_assets!media_assets_artist_id_fkey (
          id,
          url,
          file_name,
          file_type,
          description,
          is_video,
          is_embed,
          embed_source
        ),
        language_skills!language_skills_artist_id_fkey (
          id,
          language,
          proficiency
        ),
        tools_software!tools_software_artist_id_fkey (
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
    console.log('Related data counts:', {
      skills: artist.special_skills?.length || 0,
      projects: artist.projects?.length || 0,
      education: artist.education_training?.length || 0,
      media: artist.media_assets?.length || 0,
      languages: artist.language_skills?.length || 0,
      tools: artist.tools_software?.length || 0
    });

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

export const updateArtistProfile = async (artistId: string, profileData: Partial<Artist>): Promise<Artist> => {
  try {
    console.log('Updating artist profile:', artistId);
    
    const updateData = convertToUpdateData(profileData);
    
    const { data, error } = await supabase
      .from('artist_details')
      .update(updateData)
      .eq('id', artistId)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    console.log('Artist profile updated successfully');
    return data as Artist;
  } catch (error: any) {
    console.error('Error in updateArtistProfile:', error);
    throw error;
  }
};
