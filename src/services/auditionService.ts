
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 10000) // Slightly increased timeout
    );

    // Step 1: Fetch recent auditions
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
        experience_level
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: auditionsData, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error("Error fetching recent auditions:", error);
      throw error;
    }
    
    if (!auditionsData || auditionsData.length === 0) {
      console.log("No recent auditions found");
      return [];
    }

    console.log(`Successfully fetched ${auditionsData.length} recent auditions`);
    
    // Step 2: Extract unique creator_ids
    const creatorIds = [...new Set(auditionsData.map((a: any) => a.creator_id).filter(Boolean))];
    let creatorMap = new Map<string, string>();

    // Step 3: Fetch artist_details for these IDs if there are any creatorIds
    if (creatorIds.length > 0) {
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('artist_details')
        .select('id, full_name')
        .in('id', creatorIds);

      if (creatorsError) {
        console.warn('Could not fetch some creator details for recent auditions:', creatorsError);
      } else if (creatorsData) {
        creatorsData.forEach(creator => {
          creatorMap.set(creator.id, creator.full_name || 'Unknown Company');
        });
      }
    }
    
    // Step 4: Map creator names (as company) back to auditions
    const auditionsWithCompany = auditionsData.map((item: any) => {
      const companyName = item.creator_id ? creatorMap.get(item.creator_id) || 'Unknown Company' : 'Unknown Company';
      return {
        id: item.id,
        title: item.title,
        location: item.location,
        deadline: item.deadline,
        requirements: item.requirements,
        tags: item.tags || [],
        urgent: item.deadline ? isUrgent(item.deadline) : false,
        cover_image_url: item.cover_image_url,
        company: companyName, // Populated here
        category: item.category,
        age_range: item.age_range,
        gender: item.gender,
        experience_level: item.experience_level
        // Ensure all fields from Audition type are present or optional
      };
    });
    
    return auditionsWithCompany;
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
