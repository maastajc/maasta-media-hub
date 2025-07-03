
import { Artist, ArtistCategory, ExperienceLevel, Project, Education, Skill, LanguageSkill, Tool, MediaAsset, Award, CustomLink } from "@/types/artist";
import { FeaturedArtistRow, ArtistByIdRow } from "./types";

export const mapFeaturedArtistToArtist = (artist: any): Artist => {
  const skillsArray = Array.isArray(artist.special_skills) 
    ? artist.special_skills.map((s: any) => s.skill as string) 
    : [];

  // Convert custom_links from JSON to CustomLink[] type
  let customLinksArray: CustomLink[] = [];
  if (artist.custom_links) {
    try {
      if (Array.isArray(artist.custom_links)) {
        customLinksArray = artist.custom_links as CustomLink[];
      }
    } catch (e) {
      console.error('Error parsing custom_links:', e);
      customLinksArray = [];
    }
  }

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
    custom_links: customLinksArray,
    projects: [], 
    education_training: [],
    media_assets: [],
    language_skills: [],
    tools_software: [],
    awards: [],
    special_skills: skillsArray.map(skillName => ({ id: crypto.randomUUID(), skill: skillName, artist_id: artist.id })),
    skills: skillsArray
  } as Artist;
};

export const mapFallbackArtistToArtist = (artist: any): Artist => {
  // Convert custom_links from JSON to CustomLink[] type
  let customLinksArray: CustomLink[] = [];
  if (artist.custom_links) {
    try {
      if (Array.isArray(artist.custom_links)) {
        customLinksArray = artist.custom_links as CustomLink[];
      }
    } catch (e) {
      console.error('Error parsing custom_links:', e);
      customLinksArray = [];
    }
  }

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
    custom_links: customLinksArray,
    projects: [], 
    education_training: [],
    media_assets: [],
    language_skills: [],
    tools_software: [],
    awards: [],
    special_skills: [],
    skills: []
  } as Artist;
};

export const mapArtistByIdToArtist = (artistFromDb: ArtistByIdRow): Artist => {
  const { 
    special_skills, 
    language_skills, 
    tools_software, 
    projects,
    education_training,
    media_assets,
    awards,
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

  const mappedAwards: Award[] = Array.isArray(awards)
    ? awards.map(a => ({
        ...a,
        id: a.id || crypto.randomUUID(),
        title: a.title || "",
        artist_id: artistFromDb.id
    }))
    : [];

  // Convert custom_links from JSON to CustomLink[] type
  let customLinksArray: CustomLink[] = [];
  if (artistData.custom_links) {
    try {
      if (Array.isArray(artistData.custom_links)) {
        customLinksArray = artistData.custom_links as CustomLink[];
      }
    } catch (e) {
      console.error('Error parsing custom_links:', e);
      customLinksArray = [];
    }
  }

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
    custom_links: customLinksArray,
    
    special_skills: mappedSpecialSkills,
    language_skills: mappedLanguageSkills,
    tools_software: mappedToolsSoftware,
    projects: mappedProjects,
    education_training: mappedEducationTraining,
    media_assets: mappedMediaAssets,
    awards: mappedAwards,
    skills: mappedSpecialSkills.map(s => s.skill)
  } as Artist;
};
