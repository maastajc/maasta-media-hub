
export interface Audition {
  id: string;
  title: string;
  description?: string;
  location: string;
  audition_date?: string | null;
  deadline: string | null;
  requirements: string | null;
  tags: string[] | null;
  urgent?: boolean;
  company?: string;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
  compensation?: string;
  status?: string;
  applicationStatus?: string;
  creator_id?: string;
  created_at?: string;
  posterProfile?: {
    id: string;
    full_name: string;
    profile_picture?: string;
    bio?: string;
  };
}
