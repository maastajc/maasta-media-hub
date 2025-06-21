
import { supabase } from "@/integrations/supabase/client";

export const createTimeoutPromise = (message: string, timeout: number = 15000) => {
  return new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error(message)), timeout)
  );
};

export const fetchFeaturedArtistsQuery = (limit: number) => {
  console.log('Executing main featured artists query...');
  return supabase
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
      phone_number,
      date_of_birth,
      gender,
      willing_to_relocate,
      work_preference,
      years_of_experience,
      association_membership,
      personal_website,
      instagram,
      linkedin,
      youtube_vimeo,
      role,
      status,
      created_at,
      updated_at,
      special_skills (skill)
    `)
    .eq('status', 'active')
    .not('profile_picture_url', 'is', null)
    .limit(limit);
};

export const fetchFeaturedArtistsFallbackQuery = (limit: number) => {
  console.log('Executing fallback featured artists query...');
  return supabase
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
      phone_number,
      date_of_birth,
      gender,
      willing_to_relocate,
      work_preference,
      years_of_experience,
      association_membership,
      personal_website,
      instagram,
      linkedin,
      youtube_vimeo,
      role,
      status,
      created_at,
      updated_at
    `)
    .eq('status', 'active')
    .not('profile_picture_url', 'is', null)
    .limit(limit);
};

export const fetchArtistByIdQuery = (id: string) => {
  console.log('Executing main artist by ID query...');
  return supabase
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
};

export const fetchArtistByIdFallbackQuery = (id: string) => {
  console.log('Executing fallback artist by ID query...');
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
};
