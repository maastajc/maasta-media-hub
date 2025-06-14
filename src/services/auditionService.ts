import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Audition } from "@/types/audition";
import { isUrgent } from "@/utils/auditionHelpers";

// Define a type for the raw data structure returned by the Supabase query
type SupabaseAuditionSelect = {
  id: string;
  title: string;
  location: string;
  deadline: string | null;
  requirements: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  creator_id: string | null;
  category: string | null;
  age_range: string | null;
  gender: string | null;
  experience_level: string | null;
  description: string | null;
  audition_date: string | null;
  compensation: string | null;
  status: string | null;
};

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 10000)
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
        description,
        audition_date,
        compensation,
        status
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    // Type the result of the fetch operation
    const fetchResult = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: SupabaseAuditionSelect[] | null; error: any | null };

    if (fetchResult.error) {
      console.error("Error fetching recent auditions data:", fetchResult.error);
      throw fetchResult.error;
    }
    
    const auditionsData = fetchResult.data;

    if (!auditionsData || auditionsData.length === 0) {
      console.log("No recent auditions found");
      return [];
    }

    console.log(`Successfully fetched ${auditionsData.length} recent auditions. Fetching creator details...`);
    
    const creatorIds: string[] = [
      ...new Set(
        auditionsData
          .map((a: SupabaseAuditionSelect) => a.creator_id) 
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      ),
    ];
    
    let creatorMap = new Map<string, string>();

    if (creatorIds.length > 0) {
      console.log('Fetching details for recent audition creator IDs:', creatorIds);
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', creatorIds); 

      if (creatorsError) {
        console.warn('Could not fetch some creator details for recent auditions:', creatorsError);
      } else if (creatorsData) {
        creatorsData.forEach(creator => {
          creatorMap.set(creator.id, creator.full_name || 'Unknown Company');
        });
        console.log('Recent audition creator details fetched and mapped:', creatorMap);
      }
    } else {
      console.log('No valid creator IDs found for recent auditions.');
    }
    
    const auditionsWithCompany = auditionsData.map((item: SupabaseAuditionSelect): Audition => {
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
        company: companyName,
        category: item.category,
        age_range: item.age_range,
        gender: item.gender,
        experience_level: item.experience_level,
        description: item.description ?? item.requirements ?? undefined, 
        audition_date: item.audition_date || null,
        compensation: item.compensation || undefined, 
        status: item.status || 'open',
      };
    });
    
    console.log(`Processed ${auditionsWithCompany.length} recent auditions with company names.`);
    return auditionsWithCompany;
  } catch (error: any) {
    console.error("Error in fetchRecentAuditions process:", error);
    
    if (error.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else {
      toast.error("Failed to load recent auditions");
    }
    
    return [];
  }
};
