
import { supabase } from "@/integrations/supabase/client";
import { Artist, ArtistCategory, ExperienceLevel } from "@/types/artist"; // Added ArtistCategory and ExperienceLevel
import { Database } from "@/integrations/supabase/types"; // Import Database type

// Define a type alias for the row from artist_details table
type ArtistDetailsRow = Database['public']['Tables']['artist_details']['Row'];

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
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

    // Explicitly type the result of Promise.race
    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: ArtistDetailsRow[] | null; error: any };

    if (result.error) {
      console.error('Database error fetching featured artists:', result.error);
      return [];
    }

    const artistsFromDb = result.data;

    if (!artistsFromDb || artistsFromDb.length === 0) {
      console.log('No featured artists found');
      return [];
    }

    console.log(`Successfully fetched ${artistsFromDb.length} featured artists`);
    
    // Map and ensure types are correct
    return artistsFromDb.map((artist: ArtistDetailsRow): Artist => {
      const { special_skills, ...artistData } = artist;
      // The 'special_skills' from the DB structure might be an array of objects {skill: string}
      // or it might be nested if the select isn't aliased.
      // Based on the select: special_skills!fk_special_skills_artist_details (skill)
      // It should be an array of objects like { skill: string }

      // The Artist type expects special_skills to be { id: string, skill: string }[]
      // And an additional 'skills' string[]
      // The current select only gets `skill`, not `id` for special_skills.
      // For now, let's adapt to what's fetched. If `id` is needed, the query must change.
      
      const skillsArray = Array.isArray(artist.special_skills) 
        ? artist.special_skills.map((s: any) => s.skill as string) 
        : [];

      return {
        ...artistData,
        id: artistData.id, // Ensure id is present
        full_name: artistData.full_name || "Unknown Artist",
        email: artistData.email,
        category: artistData.category as ArtistCategory, // Cast to specific type
        experience_level: (artistData.experience_level as ExperienceLevel | null) ?? 'beginner', // Cast and provide default if null
        // Ensure all required fields for Artist type are present
        bio: artistData.bio || null,
        profile_picture_url: artistData.profile_picture_url || null,
        city: artistData.city || null,
        state: artistData.state || null,
        country: artistData.country || null,
        verified: artistData.verified || false,
        phone_number: artistData.phone_number || null,
        date_of_birth: artistData.date_of_birth || null,
        gender: artistData.gender || null,
        willing_to_relocate: artistData.willing_to_relocate || false,
        work_preference: artistData.work_preference || "any",
        years_of_experience: artistData.years_of_experience || 0,
        association_membership: artistData.association_membership || null,
        personal_website: artistData.personal_website || null,
        instagram: artistData.instagram || null,
        linkedin: artistData.linkedin || null,
        youtube_vimeo: artistData.youtube_vimeo || null,
        role: artistData.role || 'artist',
        status: artistData.status || 'active',
        created_at: artistData.created_at || new Date().toISOString(),
        updated_at: artistData.updated_at || new Date().toISOString(),
        projects: [], // Default if not fetched
        education_training: [], // Default if not fetched
        media_assets: [], // Default if not fetched
        language_skills: [], // Default if not fetched
        tools_software: [], // Default if not fetched
        // The DB query for featured artists doesn't fetch special_skills with IDs.
        // Artist type expects { id: string, skill: string }[]
        // We only have skill names. Let's create dummy IDs or adjust type/query.
        // For now, creating dummy IDs for compatibility if structure is rigid.
        special_skills: skillsArray.map(skill => ({ id: crypto.randomUUID(), skill })),
        skills: skillsArray // This is derived, usually good
      } as Artist; // Assert as Artist after ensuring all fields are covered
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

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: ArtistDetailsRow | null; error: any };


    if (result.error) {
      console.error('Database error fetching artist:', result.error);
      if (result.error.code === 'PGRST116') { // Not found
        throw new Error(`Artist not found with ID: ${id}`);
      }
      throw new Error(`Failed to load profile: ${result.error.message}`);
    }

    const artistFromDb = result.data;

    if (!artistFromDb) {
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artistFromDb.full_name}`);

    // Transform data with safe defaults and correct types
    const { 
      special_skills, 
      language_skills, 
      tools_software, 
      projects,
      education_training,
      media_assets,
      ...artistData 
    } = artistFromDb;
    
    return {
      ...artistData,
      id: artistData.id,
      full_name: artistData.full_name || "Unknown Artist",
      email: artistData.email,
      category: artistData.category as ArtistCategory,
      experience_level: (artistData.experience_level as ExperienceLevel | null) ?? 'beginner',
      bio: artistData.bio || null,
      profile_picture_url: artistData.profile_picture_url || null,
      city: artistData.city || null,
      state: artistData.state || null,
      country: artistData.country || null,
      verified: artistData.verified || false,
      phone_number: artistData.phone_number || null,
      date_of_birth: artistData.date_of_birth || null,
      gender: artistData.gender || null,
      willing_to_relocate: artistData.willing_to_relocate || false,
      work_preference: artistData.work_preference || "any",
      years_of_experience: artistData.years_of_experience || 0,
      association_membership: artistData.association_membership || null,
      personal_website: artistData.personal_website || null,
      instagram: artistData.instagram || null,
      linkedin: artistData.linkedin || null,
      youtube_vimeo: artistData.youtube_vimeo || null,
      role: artistData.role || 'artist',
      status: artistData.status || 'active',
      created_at: artistData.created_at || new Date().toISOString(),
      updated_at: artistData.updated_at || new Date().toISOString(),
      
      special_skills: Array.isArray(special_skills) ? special_skills.map(s => ({ id: s.id || crypto.randomUUID(), skill: s.skill || ""})) : [],
      language_skills: Array.isArray(language_skills) ? language_skills.map(l => ({id: l.id || crypto.randomUUID(), language: l.language || "", proficiency: l.proficiency || "beginner" })) : [],
      tools_software: Array.isArray(tools_software) ? tools_software.map(t => ({id: t.id || crypto.randomUUID(), tool_name: t.tool_name || ""})) : [],
      projects: Array.isArray(projects) ? projects : [],
      education_training: Array.isArray(education_training) ? education_training : [],
      media_assets: Array.isArray(media_assets) ? media_assets : [],
      skills: Array.isArray(special_skills) ? special_skills.map((s: any) => s.skill as string) : []
    } as Artist; // Assert as Artist
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    throw error; // Rethrow to be caught by useQuery
  }
};
