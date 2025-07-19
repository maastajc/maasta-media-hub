import { Artist } from "@/types/artist";

export interface ProfileStrengthSection {
  name: string;
  weight: number;
  completed: boolean;
  description: string;
}

export const useProfileStrength = (artist: Artist | null) => {
  if (!artist) {
    return {
      totalStrength: 0,
      sections: [],
      incompleteSections: [],
      getStrengthColor: () => "text-gray-500",
      getStrengthStatus: () => "Incomplete"
    };
  }

  const sections: ProfileStrengthSection[] = [
    {
      name: "Basic Information",
      weight: 5,
      completed: !!(artist.full_name && artist.bio && artist.phone_number && artist.city && artist.date_of_birth),
      description: "Complete your name, bio, phone, city, and date of birth"
    },
    {
      name: "Profile Picture",
      weight: 10,
      completed: !!artist.profile_picture_url,
      description: "Add your profile picture"
    },
    {
      name: "Cover Picture",
      weight: 5,
      completed: !!artist.cover_image_url,
      description: "Add a cover image to your profile"
    },
    {
      name: "Media Portfolio",
      weight: 15,
      completed: !!(artist.media_assets && artist.media_assets.length > 0),
      description: "Upload photos or videos to showcase your work"
    },
    {
      name: "Projects",
      weight: 15,
      completed: !!(artist.projects && artist.projects.length > 0),
      description: "Add your film, theater, or other creative projects"
    },
    {
      name: "Social Links",
      weight: 10,
      completed: (() => {
        const defaultLinks = [artist.instagram, artist.youtube_vimeo].filter(Boolean);
        const customLinks = artist.custom_links || [];
        const customLinksArray = Array.isArray(customLinks) 
          ? customLinks 
          : typeof customLinks === 'string' 
            ? JSON.parse(customLinks || '[]')
            : [];
        const validCustomLinks = customLinksArray.filter((link: any) => link?.title && link?.url);
        return defaultLinks.length > 0 || validCustomLinks.length > 0;
      })(),
      description: "Add Instagram, YouTube, or custom portfolio links"
    },
    {
      name: "Skills",
      weight: 10,
      completed: !!(artist.special_skills && artist.special_skills.length > 0),
      description: "List your special skills and talents"
    },
    {
      name: "Languages",
      weight: 5,
      completed: !!(artist.language_skills && artist.language_skills.length > 0),
      description: "Add languages you speak"
    },
    {
      name: "Tools",
      weight: 5,
      completed: !!(artist.tools_software && artist.tools_software.length > 0),
      description: "List software and tools you use"
    },
    {
      name: "Education",
      weight: 10,
      completed: !!(artist.education && artist.education.length > 0) || !!(artist.education_training && artist.education_training.length > 0),
      description: "Add your educational background and training"
    },
    {
      name: "Awards",
      weight: 5,
      completed: !!(artist.awards && artist.awards.length > 0),
      description: "Showcase your achievements and awards"
    },
    {
      name: "Work Links",
      weight: 10,
      completed: false, // This will be calculated dynamically when work_links data is available
      description: "Add links to your work portfolio, demo reels, or projects"
    }
  ];

  const completedWeight = sections.reduce((total, section) => {
    return total + (section.completed ? section.weight : 0);
  }, 0);

  const totalStrength = Math.round(completedWeight);
  const incompleteSections = sections.filter(section => !section.completed);

  const getStrengthColor = (strength: number = totalStrength) => {
    if (strength >= 70) return "text-success";
    if (strength >= 40) return "text-warning";
    return "text-destructive";
  };

  const getStrengthStatus = (strength: number = totalStrength) => {
    if (strength >= 70) return "Strong";
    if (strength >= 40) return "Good";
    return "Needs Work";
  };

  return {
    totalStrength,
    sections,
    incompleteSections,
    getStrengthColor,
    getStrengthStatus
  };
};