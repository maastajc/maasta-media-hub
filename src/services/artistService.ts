
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Artist } from "@/types/artist";

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
      throw artistsError;
    }

    // Format the artists data with proper type handling
    const formattedArtists: Artist[] = artistsData ? artistsData.map(artist => ({
      ...artist,
      skills: artist.special_skills ? artist.special_skills.map((s: any) => s.skill) : [],
      special_skills: artist.special_skills ? artist.special_skills.map((s: any, index: number) => ({
        id: `temp-${index}`, // Temporary ID for display purposes
        artist_id: artist.id,
        skill: s.skill
      })) : [],
      verified: Math.random() > 0.5 // Random verification status for demo
    })) : [];

    console.log("Formatted artists data:", formattedArtists);
    return formattedArtists;
  } catch (error: any) {
    console.error("Error fetching artists:", error);
    toast.error("Failed to load artists");
    return [];
  }
};

export const fetchArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    console.log("Fetching artist profile for ID:", artistId);
    
    // Get the main artist details
    const { data: artistDetails, error: artistError } = await supabase
      .from('artist_details')
      .select('*')
      .eq('id', artistId)
      .single();
    
    if (artistError) {
      console.error("Artist details error:", artistError);
      throw artistError;
    }

    // Get related data
    const [
      { data: projects },
      { data: education },
      { data: specialSkills },
      { data: languageSkills },
      { data: toolsSoftware },
      { data: mediaAssets }
    ] = await Promise.all([
      supabase.from("projects").select("*").eq("artist_id", artistId),
      supabase.from("education_training").select("*").eq("artist_id", artistId),
      supabase.from("special_skills").select("*").eq("artist_id", artistId),
      supabase.from("language_skills").select("*").eq("artist_id", artistId),
      supabase.from("tools_software").select("*").eq("artist_id", artistId),
      supabase.from("media_assets").select("*").eq("artist_id", artistId)
    ]);

    // Combine all data into a unified profile structure
    const artistProfile: Artist = {
      ...artistDetails,
      projects: projects || [],
      education_training: education || [],
      special_skills: specialSkills || [],
      language_skills: languageSkills || [],
      tools_software: toolsSoftware || [],
      media_assets: mediaAssets || []
    };

    console.log("Combined artist profile data:", artistProfile);
    return artistProfile;
  } catch (error: any) {
    console.error("Error fetching artist:", error);
    toast.error("Failed to load artist profile");
    return null;
  }
};

export const updateArtistProfile = async (artistId: string, profileData: Partial<Artist>): Promise<Artist | null> => {
  try {
    // Filter out nested objects that don't belong in the artist_details table
    const { projects, education_training, special_skills, language_skills, tools_software, media_assets, verified, ...updateData } = profileData;
    
    // Type cast the update data to match Supabase's expected types
    const dbUpdateData = updateData as any;
    
    const { data, error } = await supabase
      .from('artist_details')
      .update(dbUpdateData)
      .eq('id', artistId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating artist profile:", error);
      throw error;
    }
    
    console.log("Artist profile updated successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error updating artist profile:", error);
    toast.error("Failed to update profile");
    return null;
  }
};
