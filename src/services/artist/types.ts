
import { Database } from "@/integrations/supabase/types";

type ArtistDetailsRow = Database['public']['Tables']['profiles']['Row'];

// Specific type for featured artists query result
export type FeaturedArtistRow = ArtistDetailsRow & {
  special_skills: { skill: string }[];
};

// Specific type for artist by ID query result, including all relations
// This matches the actual structure returned by the Supabase query
export type ArtistByIdRow = ArtistDetailsRow & {
  special_skills: { id: string; skill: string }[];
  projects: { 
    id: string;
    project_name: string;
    role_in_project: string;
    project_type: string;
    year_of_release: number | null;
    director_producer: string | null;
    streaming_platform: string | null;
    link: string | null;
  }[];
  education_training: {
    id: string;
    qualification_name: string;
    institution: string | null;
    year_completed: number | null;
    is_academic: boolean | null;
  }[];
  media_assets: {
    id: string;
    url: string;
    file_name: string;
    file_type: string;
    description: string | null;
    is_video: boolean | null;
    is_embed: boolean | null;
    embed_source: string | null;
    file_size: number;
  }[];
  language_skills: {
    id: string;
    language: string;
    proficiency: string;
  }[];
  tools_software: {
    id: string;
    tool_name: string;
  }[];
  awards: {
    id: string;
    title: string;
    organization: string | null;
    year: number | null;
    description: string | null;
  }[];
};
