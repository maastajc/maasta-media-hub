
export interface Audition {
  id: string;
  title: string;
  description?: string; // Added description property
  location: string;
  audition_date?: string | null; // Added audition_date property
  deadline: string | null;
  requirements: string | null;
  tags: string[] | null;
  urgent?: boolean;
  cover_image_url: string | null;
  company?: string;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
  compensation?: string; // Added compensation property
  status?: string; // Added status property
}
