
import { supabase } from "@/integrations/supabase/client";

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
  console.log("Fetching recent auditions...");
  
  try {
    const { data, error } = await supabase
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

    if (error) {
      console.error("Error fetching recent auditions:", error);
      throw error;
    }

    const auditions = data || [];
    console.log(`Successfully fetched ${auditions.length} recent auditions`);
    
    const auditionsWithCompany = auditions.map((item: any): Audition => ({
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
        full_name: 'Production Company'
      },
      created_at: item.created_at,
    }));
    
    return auditionsWithCompany;
  } catch (error: any) {
    console.error("Error in fetchRecentAuditions:", error);
    return [];
  }
};
