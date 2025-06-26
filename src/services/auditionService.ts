
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Audition {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  audition_date: string;
  deadline: string;
  requirements: string;
  compensation: string;
  status: string;
  tags: string[];
  creator_profile?: {
    full_name: string;
  };
  created_at: string;
}

export const fetchRecentAuditions = async (): Promise<Audition[]> => {
  try {
    console.log("Fetching recent auditions...");
    
    // Increased timeout and simplified query
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent auditions fetch timeout')), 15000)
    );

    const fetchPromise = supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        category,
        location,
        audition_date,
        deadline,
        requirements,
        compensation,
        status,
        tags,
        created_at,
        profiles!auditions_creator_id_fkey(full_name)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    const fetchResult = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: any[] | null; error: any | null };

    if (fetchResult.error) {
      console.error("Error fetching recent auditions data:", fetchResult.error);
      
      // Fallback query without profiles join
      console.log("Trying fallback query without profiles join...");
      const fallbackResult = await supabase
        .from('auditions')
        .select(`
          id,
          title,
          description,
          category,
          location,
          audition_date,
          deadline,
          requirements,
          compensation,
          status,
          tags,
          created_at
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);

      if (fallbackResult.error) {
        throw fallbackResult.error;
      }

      const auditionsData = fallbackResult.data;
      if (!auditionsData || auditionsData.length === 0) {
        console.log("No recent auditions found");
        return [];
      }

      console.log(`Successfully fetched ${auditionsData.length} recent auditions (fallback). Processing...`);
      
      const auditionsWithCompany = auditionsData.map((item: any): Audition => {
        return {
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: item.category,
          location: item.location,
          audition_date: item.audition_date,
          deadline: item.deadline,
          requirements: item.requirements || '',
          compensation: item.compensation || '',
          status: item.status || 'open',
          tags: item.tags || [],
          creator_profile: {
            full_name: 'Casting Director' // Default name
          },
          created_at: item.created_at,
        };
      });
      
      console.log(`Processed ${auditionsWithCompany.length} recent auditions with default creator names.`);
      return auditionsWithCompany;
    }
    
    const auditionsData = fetchResult.data;

    if (!auditionsData || auditionsData.length === 0) {
      console.log("No recent auditions found");
      return [];
    }

    console.log(`Successfully fetched ${auditionsData.length} recent auditions. Processing...`);
    
    const auditionsWithCompany = auditionsData.map((item: any): Audition => {
      const creatorName = item.profiles?.full_name || 'Casting Director';
      return {
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: item.category,
        location: item.location,
        audition_date: item.audition_date,
        deadline: item.deadline,
        requirements: item.requirements || '',
        compensation: item.compensation || '',
        status: item.status || 'open',
        tags: item.tags || [],
        creator_profile: {
          full_name: creatorName
        },
        created_at: item.created_at,
      };
    });
    
    console.log(`Processed ${auditionsWithCompany.length} recent auditions with creator names.`);
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
