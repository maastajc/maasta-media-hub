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
  creator_id: string | null;
  category: string | null;
  age_range: string | null;
  gender: string | null;
  experience_level: string | null;
  description: string | null;
  audition_date: string | null;
  compensation: string | null;
  status: string | null;
  profiles: { full_name: string } | null;
};

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 20000)
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
        creator_id,
        category,
        age_range,
        gender,
        experience_level,
        description,
        audition_date,
        compensation,
        status,
        profiles (full_name)
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

    console.log(`Successfully fetched ${auditionsData.length} recent auditions. Processing...`);
    
    const auditionsWithCompany = auditionsData.map((item: SupabaseAuditionSelect): Audition => {
      const companyName = item.profiles?.full_name || 'Unknown Company';
      return {
        id: item.id,
        title: item.title,
        location: item.location,
        deadline: item.deadline,
        requirements: item.requirements,
        tags: item.tags || [],
        urgent: item.deadline ? isUrgent(item.deadline) : false,
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
