
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

// Fallback data when database is empty or has issues
const FALLBACK_AUDITIONS: Audition[] = [
  {
    id: "fallback-1",
    title: "Lead Actor - Feature Film",
    description: "Seeking experienced actors for lead roles in upcoming feature film production.",
    location: "Mumbai, Maharashtra",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: "5+ years acting experience, comfortable with dramatic scenes",
    tags: ["Drama", "Feature Film", "Lead Role"],
    urgent: true,
    company: "Silver Screen Productions",
    category: "actor",
    age_range: "25-40",
    gender: "any",
    experience_level: "experienced",
    compensation: "₹2,00,000 - ₹5,00,000",
    status: "open"
  },
  {
    id: "fallback-2", 
    title: "Background Dancers - Music Video",
    description: "Looking for energetic dancers for upcoming music video shoot.",
    location: "Delhi, NCR",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: "Professional dance training, various styles preferred",
    tags: ["Dance", "Music Video", "Background"],
    urgent: false,
    company: "Rhythm Studios",
    category: "dancer",
    age_range: "20-35",
    gender: "any", 
    experience_level: "intermediate",
    compensation: "₹10,000 - ₹25,000",
    status: "open"
  },
  {
    id: "fallback-3",
    title: "Voice Artist - Commercial",
    description: "Need professional voice artists for radio and TV commercials.",
    location: "Bangalore, Karnataka", 
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: "Clear voice, experience with commercial voice work",
    tags: ["Voice", "Commercial", "Radio"],
    urgent: false,
    company: "Audio Works",
    category: "voice_artist",
    age_range: "25-50",
    gender: "any",
    experience_level: "professional", 
    compensation: "₹15,000 - ₹30,000",
    status: "open"
  }
];

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    // Much shorter timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 3000)
    );

    const fetchPromise = supabase
      .from('auditions')
      .select(`
        id,
        title,
        location,
        deadline,
        requirements,
        tags,
        cover_image_url,
        creator_id,
        category,
        age_range,
        gender,
        experience_level,
        compensation,
        status,
        description
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error("Error fetching recent auditions:", error);
      console.log("Using fallback auditions data");
      return FALLBACK_AUDITIONS;
    }
    
    if (!data || data.length === 0) {
      console.log("No recent auditions found, using fallback data");
      return FALLBACK_AUDITIONS;
    }

    console.log(`Successfully fetched ${data.length} recent auditions`);
    
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || item.requirements || '',
      location: item.location,
      deadline: item.deadline,
      requirements: item.requirements,
      tags: item.tags || [],
      urgent: item.deadline ? isUrgent(item.deadline) : false,
      company: 'Production House',
      category: item.category,
      age_range: item.age_range,
      gender: item.gender,
      experience_level: item.experience_level,
      compensation: item.compensation,
      status: item.status || 'open'
    }));
  } catch (error: any) {
    console.error("Error fetching recent auditions:", error);
    console.log("Using fallback auditions data due to error");
    return FALLBACK_AUDITIONS;
  }
};
