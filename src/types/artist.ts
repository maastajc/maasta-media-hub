export interface Project {
  id: string;
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
  user_id: string;
  institution_name: string;
  degree_name: string;
  field_of_study?: string;
  graduation_year?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialSkill {
  id: string;
  user_id: string;
  skill_name: string;
  years_of_experience?: number;
  proficiency_level?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LanguageSkill {
  id: string;
  user_id: string;
  language_name: string;
  proficiency_level?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ToolSoftware {
  id: string;
  user_id: string;
  tool_name: string;
  years_of_experience?: number;
  proficiency_level?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  user_id: string;
  asset_type: string;
  asset_url: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Award {
  id: string;
  user_id: string;
  award_name: string;
  awarding_organization: string;
  year_received?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfessionalReference {
  id: string;
  user_id: string;
  reference_name: string;
  reference_title: string;
  reference_company: string;
  reference_email: string;
  reference_phone: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
  category?: string;
  experience_level?: string;
  years_of_experience?: number;
  association_membership?: string;
  work_preference?: string;
  personal_website?: string;
  instagram?: string;
  linkedin?: string;
  youtube_vimeo?: string;
  imdb_profile?: string;
  behance?: string;
  custom_links?: any; // JSON array of {title: string, url: string}
  preferred_domains?: string;
  cover_image_url?: string;
  headline?: string;
  about?: string;
  username?: string;
  date_of_birth?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  projects?: Project[];
  education?: Education[];
  special_skills?: SpecialSkill[];
  language_skills?: LanguageSkill[];
  tools_software?: ToolSoftware[];
  media_assets?: MediaAsset[];
  awards?: Award[];
  professional_references?: ProfessionalReference[];
}
