
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    const { data, error } = await supabase
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
        profiles:profiles(full_name)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching recent auditions:", error);
      throw error;
    } else if (data) {
      // Transform the data to match our component's expected format
      return data.map(item => ({
        id: item.id,
        title: item.title,
        location: item.location,
        deadline: item.deadline,
        requirements: item.requirements,
        tags: item.tags || [],
        urgent: item.deadline ? isUrgent(item.deadline) : false,
        cover_image_url: item.cover_image_url,
        company: item.profiles?.full_name || 'Unknown Company',
        category: item.category,
        age_range: item.age_range,
        gender: item.gender,
        experience_level: item.experience_level
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching recent auditions:", error);
    toast.error("Failed to load recent auditions");
    return [];
  }
};
