
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Artist } from "@/types/artist";

// Cache for artist data to reduce redundant calls
const artistCache = new Map<string, { data: Artist; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to validate artist data
const validateArtistData = (data: any): data is Artist => {
  return data && 
         typeof data.id === 'string' && 
         typeof data.full_name === 'string' && 
         typeof data.email === 'string';
};

// Helper function to format artist data with proper fallbacks
const formatArtistData = (artistData: any): Artist => {
  if (!validateArtistData(artistData)) {
    console.warn("Invalid artist data structure:", artistData);
  }

  return {
    id: artistData.id || '',
    full_name: artistData.full_name || 'Unknown Artist',
    email: artistData.email || '',
    bio: artistData.bio || null,
    profile_picture_url: artistData.profile_picture_url || null,
    city: artistData.city || null,
    state: artistData.state || null,
    country: artistData.country || null,
    phone_number: artistData.phone_number || null,
    date_of_birth: artistData.date_of_birth || null,
    gender: artistData.gender || null,
    instagram: artistData.instagram || null,
    linkedin: artistData.linkedin || null,
    youtube_vimeo: artistData.youtube_vimeo || null,
    personal_website: artistData.personal_website || null,
    category: artistData.category || null,
    experience_level: artistData.experience_level || null,
    years_of_experience: artistData.years_of_experience || 0,
    role: artistData.role || 'artist',
    verified: Math.random() > 0.5, // Random verification status for demo
    status: artistData.status || 'active',
    work_preference: artistData.work_preference || null,
    willing_to_relocate: artistData.willing_to_relocate || false,
    imdb_profile: artistData.imdb_profile || null,
    association_membership: artistData.association_membership || null,
    rate_card: artistData.rate_card || null,
    created_at: artistData.created_at || null,
    updated_at: artistData.updated_at || null,
    
    // Related data with proper fallbacks
    projects: artistData.projects || [],
    education_training: artistData.education_training || [],
    special_skills: artistData.special_skills || [],
    language_skills: artistData.language_skills || [],
    tools_software: artistData.tools_software || [],
    media_assets: artistData.media_assets || []
  };
};

export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log("Fetching all artists from artist_details table...");
    
    const { data: artistsData, error: artistsError } = await supabase
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
        instagram,
        linkedin,
        category,
        experience_level,
        years_of_experience,
        special_skills!fk_special_skills_artist_details (skill)
      `);

    if (artistsError) {
      console.error("Error fetching artists:", artistsError);
      toast.error("Failed to load artists. Please try again.");
      return [];
    }

    if (!artistsData || artistsData.length === 0) {
      console.log("No artists found in database");
      return [];
    }

    // Format the artists data with proper error handling
    const formattedArtists: Artist[] = artistsData.map(artist => {
      try {
        const formattedArtist = formatArtistData({
          ...artist,
          skills: artist.special_skills ? artist.special_skills.map((s: any) => s.skill) : [],
          special_skills: artist.special_skills ? artist.special_skills.map((s: any, index: number) => ({
            id: `temp-${index}`,
            artist_id: artist.id,
            skill: s.skill
          })) : []
        });
        
        return formattedArtist;
      } catch (error) {
        console.error("Error formatting artist data:", error, artist);
        // Return a minimal valid artist object if formatting fails
        return formatArtistData({
          id: artist.id,
          full_name: artist.full_name || 'Unknown Artist',
          email: artist.email || ''
        });
      }
    });

    console.log("Successfully formatted artists data:", formattedArtists.length, "artists");
    return formattedArtists;
  } catch (error: any) {
    console.error("Unexpected error fetching artists:", error);
    toast.error("An unexpected error occurred while loading artists");
    return [];
  }
};

export const fetchArtistById = async (artistId: string): Promise<Artist | null> => {
  if (!artistId) {
    console.warn("fetchArtistById called with empty artistId");
    return null;
  }

  // Check cache first
  const cached = artistCache.get(artistId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Returning cached artist data for:", artistId);
    return cached.data;
  }

  try {
    console.log("Fetching artist profile for ID:", artistId);
    
    // Get the main artist details - RLS will automatically handle permissions
    const { data: artistDetails, error: artistError } = await supabase
      .from('artist_details')
      .select('*')
      .eq('id', artistId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no data gracefully
    
    if (artistError) {
      console.error("Artist details error:", artistError);
      toast.error("Failed to load artist profile");
      return null;
    }

    if (!artistDetails) {
      console.log("No artist profile found for ID:", artistId);
      return null;
    }

    // Get related data with proper error handling for each query
    const relatedDataPromises = [
      supabase.from("projects").select("*").eq("artist_id", artistId),
      supabase.from("education_training").select("*").eq("artist_id", artistId),
      supabase.from("special_skills").select("*").eq("artist_id", artistId),
      supabase.from("language_skills").select("*").eq("artist_id", artistId),
      supabase.from("tools_software").select("*").eq("artist_id", artistId),
      supabase.from("media_assets").select("*").eq("artist_id", artistId)
    ];

    const results = await Promise.allSettled(relatedDataPromises);
    
    // Extract data with fallbacks for failed queries
    const [
      projectsResult,
      educationResult,
      skillsResult,
      languageResult,
      toolsResult,
      mediaResult
    ] = results;

    const projects = projectsResult.status === 'fulfilled' ? projectsResult.value.data || [] : [];
    const education = educationResult.status === 'fulfilled' ? educationResult.value.data || [] : [];
    const specialSkills = skillsResult.status === 'fulfilled' ? skillsResult.value.data || [] : [];
    const languageSkills = languageResult.status === 'fulfilled' ? languageResult.value.data || [] : [];
    const toolsSoftware = toolsResult.status === 'fulfilled' ? toolsResult.value.data || [] : [];
    const mediaAssets = mediaResult.status === 'fulfilled' ? mediaResult.value.data || [] : [];

    // Log any failed queries
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const tableNames = ['projects', 'education_training', 'special_skills', 'language_skills', 'tools_software', 'media_assets'];
        console.warn(`Failed to fetch ${tableNames[index]} for artist ${artistId}:`, result.reason);
      }
    });

    // Combine all data into a unified profile structure
    const artistProfile: Artist = formatArtistData({
      ...artistDetails,
      projects,
      education_training: education,
      special_skills: specialSkills,
      language_skills: languageSkills,
      tools_software: toolsSoftware,
      media_assets: mediaAssets
    });

    // Cache the result
    artistCache.set(artistId, { data: artistProfile, timestamp: Date.now() });

    console.log("Successfully loaded artist profile for:", artistId);
    return artistProfile;
  } catch (error: any) {
    console.error("Unexpected error fetching artist:", error);
    toast.error("An unexpected error occurred while loading the artist profile");
    return null;
  }
};

export const updateArtistProfile = async (artistId: string, profileData: Partial<Artist>): Promise<Artist | null> => {
  if (!artistId) {
    console.error("updateArtistProfile called with empty artistId");
    toast.error("Invalid artist ID");
    return null;
  }

  if (!profileData || Object.keys(profileData).length === 0) {
    console.warn("updateArtistProfile called with empty profile data");
    toast.error("No data to update");
    return null;
  }

  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Authentication error:", authError);
      toast.error("Authentication failed. Please sign in again.");
      return null;
    }

    if (!user) {
      toast.error("You must be signed in to update your profile");
      return null;
    }

    if (user.id !== artistId) {
      console.error("User trying to update profile they don't own:", { userId: user.id, artistId });
      toast.error("You can only update your own profile");
      return null;
    }

    // Filter out nested objects that don't belong in the artist_details table
    const { projects, education_training, special_skills, language_skills, tools_software, media_assets, verified, ...updateData } = profileData;
    
    // Validate required fields
    if (updateData.full_name !== undefined && (!updateData.full_name || updateData.full_name.trim().length === 0)) {
      toast.error("Full name is required");
      return null;
    }

    if (updateData.email !== undefined && (!updateData.email || !updateData.email.includes('@'))) {
      toast.error("Valid email is required");
      return null;
    }

    // Type cast the update data to match Supabase's expected types
    const dbUpdateData = updateData as any;
    
    const { data, error } = await supabase
      .from('artist_details')
      .update(dbUpdateData)
      .eq('id', artistId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error("Error updating artist profile:", error);
      
      if (error.code === '42501') {
        toast.error("You don't have permission to update this profile");
        return null;
      }
      
      if (error.code === '23505') {
        toast.error("Email address is already in use");
        return null;
      }
      
      toast.error("Failed to update profile. Please try again.");
      return null;
    }
    
    if (!data) {
      console.error("No data returned after update for artist:", artistId);
      toast.error("Profile update failed - no data returned");
      return null;
    }
    
    // Clear cache for this artist
    artistCache.delete(artistId);
    
    console.log("Artist profile updated successfully:", data);
    toast.success("Profile updated successfully");
    
    return formatArtistData(data);
  } catch (error: any) {
    console.error("Unexpected error updating artist profile:", error);
    toast.error("An unexpected error occurred while updating your profile");
    return null;
  }
};

// Helper function to clear cache (useful for testing or forced refresh)
export const clearArtistCache = (artistId?: string) => {
  if (artistId) {
    artistCache.delete(artistId);
  } else {
    artistCache.clear();
  }
};
