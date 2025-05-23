
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    // First try with all fields
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
        profiles:profiles(full_name)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      // Check if the error is specifically about missing columns
      if (error.message?.includes("column 'tags' does not exist") || 
          error.message?.includes("column 'cover_image_url' does not exist")) {
        console.warn("Using fallback query for auditions due to missing columns:", error.message);
        
        // Fallback query without the new columns
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('auditions')
          .select(`
            id,
            title,
            location,
            deadline,
            requirements,
            creator_id,
            profiles:profiles(full_name)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw fallbackError;
        }
        
        if (fallbackData) {
          // Transform the data to match our component's expected format
          return fallbackData.map(item => ({
            id: item.id,
            title: item.title,
            location: item.location,
            deadline: item.deadline,
            requirements: item.requirements,
            tags: [] as string[], // Empty array as fallback
            urgent: item.deadline ? isUrgent(item.deadline) : false,
            cover_image_url: null, // Null as fallback
            company: item.profiles?.full_name || 'Unknown Company'
          }));
        } else {
          return [];
        }
      } else {
        // Handle other types of errors
        throw error;
      }
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
        company: item.profiles?.full_name || 'Unknown Company'
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
