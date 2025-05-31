
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 8000)
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
        profiles!auditions_creator_id_fkey(full_name)
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
      throw error;
    }
    
    if (!data) {
      console.log("No recent auditions found");
      return [];
    }

    console.log(`Successfully fetched ${data.length} recent auditions`);
    
    return data.map((item: any) => ({
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
  } catch (error: any) {
    console.error("Error fetching recent auditions:", error);
    
    if (error.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else {
      toast.error("Failed to load recent auditions");
    }
    
    return [];
  }
};
