
export interface Artist {
  id: string;
  full_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  country?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  instagram?: string;
  linkedin?: string;
  youtube_vimeo?: string;
  personal_website?: string;
  category?: string;
  experience_level?: string;
  years_of_experience?: number;
  role?: string;
  verified?: boolean;
  status?: string;
  work_preference?: string;
  willing_to_relocate?: boolean;
  imdb_profile?: string;
  association_membership?: string;
  rate_card?: any;
  created_at?: string;
  updated_at?: string;
  skills?: string[]; // Added skills property
  
  // Related data
  projects?: Project[];
  education_training?: Education[];
  special_skills?: Skill[];
  language_skills?: LanguageSkill[];
  tools_software?: Tool[];
  professional_references?: ProfessionalReference[];
  media_assets?: MediaAsset[];
}

export interface Project {
  id: string;
  artist_id: string;
  project_name: string;
  project_type: string;
  role_in_project: string;
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
  qualification_name: string;
  institution?: string;
  year_completed?: number;
  is_academic?: boolean;
  created_at?: string;
}

export interface Skill {
  id: string;
  artist_id: string;
  skill: string;
}

export interface LanguageSkill {
  id: string;
  artist_id: string;
  language: string;
  proficiency: string;
}

export interface Tool {
  id: string;
  artist_id: string;
  tool_name: string;
}

export interface ProfessionalReference {
  id: string;
  artist_id: string;
  name: string;
  role: string;
  contact?: string;
  created_at?: string;
}

export interface MediaAsset {
  id: string;
  artist_id: string;
  user_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  description?: string;
  is_video?: boolean;
  is_embed?: boolean;
  embed_source?: string;
  created_at?: string;
}
