
import { useMemo } from 'react';
import { Artist } from '@/types/artist';

interface SafeProfileData {
  id: string;
  full_name: string;
  email: string;
  bio: string | null;
  category: string;
  experience_level: string;
  years_of_experience: number;
  city: string | null;
  state: string | null;
  country: string | null;
  profile_picture_url: string | null;
  custom_links: any[];
  projects: any[];
  education: any[];
  education_training: any[];
  special_skills: any[];
  media_assets: any[];
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  willing_to_relocate: boolean;
  work_preference: string;
  association_membership: string | null;
  personal_website: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube_vimeo: string | null;
  role: string;
  status: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useSafeProfile = (profileData: Artist | null | undefined, userId?: string): SafeProfileData | null => {
  return useMemo(() => {
    if (!profileData && !userId) {
      return null;
    }

    // Provide safe defaults for new users
    const safeProfile: SafeProfileData = {
      id: profileData?.id || userId || '',
      full_name: profileData?.full_name || 'New User',
      email: profileData?.email || '',
      bio: profileData?.bio || null,
      category: profileData?.category || 'actor',
      experience_level: profileData?.experience_level || 'beginner',
      years_of_experience: profileData?.years_of_experience || 0,
      city: profileData?.city || null,
      state: profileData?.state || null,
      country: profileData?.country || null,
      profile_picture_url: profileData?.profile_picture_url || null,
      custom_links: Array.isArray(profileData?.custom_links) ? profileData.custom_links : [],
      projects: Array.isArray(profileData?.projects) ? profileData.projects : [],
      education: Array.isArray(profileData?.education) ? profileData.education : [],
      education_training: Array.isArray(profileData?.education_training) ? profileData.education_training : [],
      special_skills: Array.isArray(profileData?.special_skills) ? profileData.special_skills : [],
      media_assets: Array.isArray(profileData?.media_assets) ? profileData.media_assets : [],
      phone_number: profileData?.phone_number || null,
      date_of_birth: profileData?.date_of_birth || null,
      gender: profileData?.gender || null,
      willing_to_relocate: profileData?.willing_to_relocate || false,
      work_preference: profileData?.work_preference || 'any',
      association_membership: profileData?.association_membership || null,
      personal_website: profileData?.personal_website || null,
      instagram: profileData?.instagram || null,
      linkedin: profileData?.linkedin || null,
      youtube_vimeo: profileData?.youtube_vimeo || null,
      role: profileData?.role || 'artist',
      status: profileData?.status || 'active',
      verified: profileData?.verified || false,
      created_at: profileData?.created_at || new Date().toISOString(),
      updated_at: profileData?.updated_at || new Date().toISOString(),
    };

    return safeProfile;
  }, [profileData, userId]);
};
