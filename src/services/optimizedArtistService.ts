
import { supabase } from "@/integrations/supabase/client";
import { Artist, ArtistCategory, ExperienceLevel, Project, Education, Skill, LanguageSkill, Tool, MediaAsset } from "@/types/artist";
import { Database } from "@/integrations/supabase/types";

type ArtistDetailsRow = Database['public']['Tables']['profiles']['Row'];

// Specific type for featured artists query result
type FeaturedArtistRow = ArtistDetailsRow & {
  special_skills: { skill: string }[];
};

// Specific type for artist by ID query result, including all relations
type ArtistByIdRow = ArtistDetailsRow & {
  special_skills: Database['public']['Tables']['special_skills']['Row'][];
  projects: Database['public']['Tables']['projects']['Row'][];
  education_training: Database['public']['Tables']['education_training']['Row'][];
  media_assets: Database['public']['Tables']['media_assets']['Row'][];
  language_skills: Database['public']['Tables']['language_skills']['Row'][];
  tools_software: Database['public']['Tables']['tools_software']['Row'][];
};

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please check your connection')), 8000)
    );

    const fetchPromise = supabase
      .from('profiles')
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
        special_skills (skill)
      `)
      .eq('status', 'active')
      .not('profile_picture_url', 'is', null)
      .limit(limit);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: FeaturedArtistRow[] | null; error: any };

    if (result.error) {
      console.error('Database error fetching featured artists:', result.error);
      
      // Fallback query without special_skills join
      console.log('Trying fallback query without special_skills join...');
      const fallbackResult = await supabase
        .from('profiles')
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
        .not('profile_picture_url', 'is', null)
        .limit(limit);

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        return [];
      }

      const artistsFromDb = fallbackResult.data || [];
      console.log(`Successfully fetched ${artistsFromDb.length} featured artists (fallback)`);
      
      return artistsFromDb.map((artist): Artist => ({
        ...artist,
        id: artist.id,
        full_name: artist.full_name || "Unknown Artist",
        email: artist.email,
        category: artist.category as ArtistCategory,
        experience_level: (artist.experience_level as ExperienceLevel | null) ?? 'beginner',
        bio: artist.bio || null,
        profile_picture_url: artist.profile_picture_url || null,
        city: artist.city || null,
        state: artist.state || null,
        country: artist.country || null,
        verified: artist.verified || false,
        phone_number: artist.phone_number ||  null,
        date_of_birth: artist.date_of_birth || null,
        gender: artist.gender || null,
        willing_to_relocate: artist.willing_to_relocate || false,
        work_preference: artist.work_preference || "any",
        years_of_experience: artist.years_of_experience || 0,
        association_membership: artist.association_membership || null,
        personal_website: artist.personal_website || null,
        instagram: artist.instagram || null,
        linkedin: artist.linkedin || null,
        youtube_vimeo: artist.youtube_vimeo || null,
        role: artist.role || 'artist',
        status: artist.status || 'active',
        created_at: artist.created_at || new Date().toISOString(),
        updated_at: artist.updated_at || new Date().toISOString(),
        projects: [], 
        education_training: [],
        media_assets: [],
        language_skills: [],
        tools_software: [],
        special_skills: [],
        skills: []
      } as Artist));
    }

    const artistsFromDb = result.data;

    if (!artistsFromDb || artistsFromDb.length === 0) {
      console.log('No featured artists found');
      return [];
    }

    console.log(`Successfully fetched ${artistsFromDb.length} featured artists`);
    
    return artistsFromDb.map((artist): Artist => {
      const skillsArray = Array.isArray(artist.special_skills) 
        ? artist.special_skills.map((s: any) => s.skill as string) 
        : [];

      return {
        ...artist,
        id: artist.id,
        full_name: artist.full_name || "Unknown Artist",
        email: artist.email,
        category: artist.category as ArtistCategory,
        experience_level: (artist.experience_level as ExperienceLevel | null) ?? 'beginner',
        bio: artist.bio || null,
        profile_picture_url: artist.profile_picture_url || null,
        city: artist.city || null,
        state: artist.state || null,
        country: artist.country || null,
        verified: artist.verified || false,
        phone_number: artist.phone_number || null,
        date_of_birth: artist.date_of_birth || null,
        gender: artist.gender || null,
        willing_to_relocate: artist.willing_to_relocate || false,
        work_preference: artist.work_preference || "any",
        years_of_experience: artist.years_of_experience || 0,
        association_membership: artist.association_membership || null,
        personal_website: artist.personal_website || null,
        instagram: artist.instagram || null,
        linkedin: artist.linkedin || null,
        youtube_vimeo: artist.youtube_vimeo || null,
        role: artist.role || 'artist',
        status: artist.status || 'active',
        created_at: artist.created_at || new Date().toISOString(),
        updated_at: artist.updated_at || new Date().toISOString(),
        projects: [], 
        education_training: [],
        media_assets: [],
        language_skills: [],
        tools_software: [],
        special_skills: skillsArray.map(skillName => ({ id: crypto.randomUUID(), skill: skillName, artist_id: artist.id })),
        skills: skillsArray
      } as Artist;
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
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Profile loading timeout - please try again')), 8000)
    );

    const fetchPromise = supabase
      .from('profiles')
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
        media_assets (
          id,
          url,
          file_name,
          file_type,
          description,
          is_video,
          is_embed,
          embed_source,
          file_size
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
    ]) as { data: ArtistByIdRow | null; error: any };

    if (result.error) {
      console.error('Database error fetching artist:', result.error);
      if (result.error.code === 'PGRST116') { 
        throw new Error(`Artist not found with ID: ${id}`);
      }
      
      // Try fallback query without joins
      console.log('Trying fallback query without joins...');
      const fallbackResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (fallbackResult.error) {
        throw new Error(`Failed to load profile: ${fallbackResult.error.message}`);
      }

      const artistFromDb = fallbackResult.data;
      if (!artistFromDb) {
        throw new Error(`No artist data returned for ID: ${id}`);
      }

      console.log(`Successfully fetched artist (fallback): ${artistFromDb.full_name}`);
      
      return {
        ...artistFromDb,
        id: artistFromDb.id,
        full_name: artistFromDb.full_name || "Unknown Artist",
        email: artistFromDb.email,
        category: artistFromDb.category as ArtistCategory,
        experience_level: (artistFromDb.experience_level as ExperienceLevel | null) ?? 'beginner',
        bio: artistFromDb.bio || null,
        profile_picture_url: artistFromDb.profile_picture_url || null,
        city: artistFromDb.city || null,
        state: artistFromDb.state || null,
        country: artistFromDb.country || null,
        verified: artistFromDb.verified || false,
        phone_number: artistFromDb.phone_number || null,
        date_of_birth: artistFromDb.date_of_birth || null,
        gender: artistFromDb.gender || null,
        willing_to_relocate: artistFromDb.willing_to_relocate || false,
        work_preference: artistFromDb.work_preference || "any",
        years_of_experience: artistFromDb.years_of_experience || 0,
        association_membership: artistFromDb.association_membership || null,
        personal_website: artistFromDb.personal_website || null,
        instagram: artistFromDb.instagram || null,
        linkedin: artistFromDb.linkedin || null,
        youtube_vimeo: artistFromDb.youtube_vimeo || null,
        role: artistFromDb.role || 'artist',
        status: artistFromDb.status || 'active',
        created_at: artistFromDb.created_at || new Date().toISOString(),
        updated_at: artistFromDb.updated_at || new Date().toISOString(),
        
        special_skills: [],
        language_skills: [],
        tools_software: [],
        projects: [],
        education_training: [],
        media_assets: [],
        skills: []
      } as Artist;
    }

    const artistFromDb = result.data;

    if (!artistFromDb) {
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artistFromDb.full_name}`);
    
    // Destructuring from ArtistByIdRow will now correctly include relational fields
    const { 
      special_skills, 
      language_skills, 
      tools_software, 
      projects,
      education_training,
      media_assets,
      ...artistData 
    } = artistFromDb;
    
    const mappedSpecialSkills: Skill[] = Array.isArray(special_skills) 
      ? special_skills.map(s => ({ 
          id: s.id || crypto.randomUUID(), 
          skill: s.skill || "", 
          artist_id: artistFromDb.id
        })) 
      : [];

    const mappedLanguageSkills: LanguageSkill[] = Array.isArray(language_skills) 
      ? language_skills.map(l => ({
          id: l.id || crypto.randomUUID(), 
          language: l.language || "", 
          proficiency: l.proficiency || "beginner", 
          artist_id: artistFromDb.id
        })) 
      : [];
      
    const mappedToolsSoftware: Tool[] = Array.isArray(tools_software) 
      ? tools_software.map(t => ({
          id: t.id || crypto.randomUUID(), 
          tool_name: t.tool_name || "", 
          artist_id: artistFromDb.id
        })) 
      : [];

    const mappedProjects: Project[] = Array.isArray(projects)
      ? projects.map(p => ({
          ...p,
          id: p.id || crypto.randomUUID(),
          project_name: p.project_name || "",
          role_in_project: p.role_in_project || "",
          project_type: p.project_type || "other",
          artist_id: artistFromDb.id
      }))
      : [];

    const mappedEducationTraining: Education[] = Array.isArray(education_training)
      ? education_training.map(e => ({
          ...e,
          id: e.id || crypto.randomUUID(),
          qualification_name: e.qualification_name || "",
          artist_id: artistFromDb.id
      }))
      : [];

    const mappedMediaAssets: MediaAsset[] = Array.isArray(media_assets)
      ? media_assets.map(m => ({
          ...m,
          id: m.id || crypto.randomUUID(),
          file_name: m.file_name || "",
          file_type: m.file_type || "",
          url: m.url || "",
          file_size: m.file_size || 0,
          artist_id: artistFromDb.id
      }))
      : [];

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
      
      special_skills: mappedSpecialSkills,
      language_skills: mappedLanguageSkills,
      tools_software: mappedToolsSoftware,
      projects: mappedProjects,
      education_training: mappedEducationTraining,
      media_assets: mappedMediaAssets,
      skills: mappedSpecialSkills.map(s => s.skill)
    } as Artist;
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    throw error; 
  }
};
