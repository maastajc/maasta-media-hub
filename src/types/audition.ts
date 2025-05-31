
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
}
