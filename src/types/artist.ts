
export interface Project {
  id: string;
  artist_id: string;
  user_id: string;
  project_name: string;
  project_type: string;
  role_in_project: string;
  description?: string;
  year_of_release?: number;
  director_producer?: string;
  streaming_platform?: string;
  link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  artist_id: string;
  user_id: string;
  qualification_name: string;
  institution?: string;
  year_completed?: number;
  is_academic?: boolean;
  created_at?: string;
}

export interface SpecialSkill {
  id: string;
  artist_id: string;
  user_id: string;
  skill: string;
}

// Export Skill as alias for SpecialSkill for backward compatibility
export type Skill = SpecialSkill;

export interface LanguageSkill {
  id: string;
  artist_id: string;
  user_id: string;
  language: string;
  proficiency: string;
}

export interface ToolSoftware {
  id: string;
  artist_id: string;
  user_id: string;
  tool_name: string;
}

// Export Tool as alias for ToolSoftware for backward compatibility
export type Tool = ToolSoftware;

export interface MediaAsset {
  id: string;
  artist_id?: string;
  user_id: string;
  asset_type: string;
  asset_url: string;
  url?: string; // Keep for backward compatibility
  file_name: string;
  file_type: string;
  file_size: number;
  description?: string;
  is_video?: boolean;
  is_embed?: boolean;
  embed_source?: string;
  created_at?: string;
}

export interface Award {
  id: string;
  artist_id: string;
  user_id: string;
  award_name: string;
  awarding_organization?: string;
  year?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfessionalReference {
  id: string;
  artist_id: string;
  user_id: string;
  reference_name: string;
  reference_title: string;
  reference_company?: string;
  contact?: string;
  created_at?: string;
}

export type ArtistCategory = 'actor' | 'director' | 'cinematographer' | 'musician' | 'editor' | 'art_director' | 'stunt_coordinator' | 'producer' | 'writer' | 'other';

export type ExperienceLevel = 'beginner' | 'fresher' | 'intermediate' | 'expert' | 'veteran';

export interface CustomLink {
  id: string;
  title: string;
  url: string;
}

export interface Artist {
  id: string;
  full_name: string;
  email: string;
  bio?: string;
  phone_number?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture_url?: string;
  category?: ArtistCategory;
  experience_level?: ExperienceLevel;
  years_of_experience?: number;
  association_membership?: string;
  work_preference?: string;
  willing_to_relocate?: boolean;
  personal_website?: string;
  instagram?: string;
  linkedin?: string;
  youtube_vimeo?: string;
  imdb_profile?: string;
  behance?: string;
  custom_links?: CustomLink[];
  preferred_domains?: string;
  cover_image_url?: string;
  headline?: string;
  about?: string;
  username?: string;
  date_of_birth?: string;
  role?: string;
  status?: string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  projects?: Project[];
  education?: Education[];
  education_training?: Education[];
  special_skills?: SpecialSkill[];
  language_skills?: LanguageSkill[];
  tools_software?: ToolSoftware[];
  media_assets?: MediaAsset[];
  awards?: Award[];
  professional_references?: ProfessionalReference[];
  skills?: string[]; // Add this for backward compatibility
}
