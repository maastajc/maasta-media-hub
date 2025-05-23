
export interface Audition {
  id: string;
  title: string;
  location: string;
  deadline: string | null;
  requirements: string | null;
  tags: string[] | null;
  urgent: boolean;
  cover_image_url: string | null;
  company: string;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
}
