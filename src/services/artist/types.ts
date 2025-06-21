
import { Database } from "@/integrations/supabase/types";

type ArtistDetailsRow = Database['public']['Tables']['profiles']['Row'];

// Specific type for featured artists query result
export type FeaturedArtistRow = ArtistDetailsRow & {
  special_skills: { skill: string }[];
};

// Specific type for artist by ID query result, including all relations
export type ArtistByIdRow = ArtistDetailsRow & {
  special_skills: Database['public']['Tables']['special_skills']['Row'][];
  projects: Database['public']['Tables']['projects']['Row'][];
  education_training: Database['public']['Tables']['education_training']['Row'][];
  media_assets: Database['public']['Tables']['media_assets']['Row'][];
  language_skills: Database['public']['Tables']['language_skills']['Row'][];
  tools_software: Database['public']['Tables']['tools_software']['Row'][];
};
