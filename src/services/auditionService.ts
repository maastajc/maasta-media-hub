
import { supabase } from "@/integrations/supabase/client";
import { Audition } from "@/types/audition";

const createTimeoutPromise = (message: string, timeout: number = 8000) => {
  return new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error(message)), timeout)
  );
};

export const fetchRecentAuditions = async (limit: number = 6): Promise<Audition[]> => {
  try {
    console.log('Fetching recent auditions...');
    
    const timeoutPromise = createTimeoutPromise('Recent auditions fetch timeout', 8000);
    
    // Simplified query without complex joins
    const fetchPromise = supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        location,
        audition_date,
        deadline,
        compensation,
        requirements,
        status,
        category,
        experience_level,
        gender,
        age_range,
        tags,
        creator_id,
        created_at
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(limit);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: any[] | null; error: any };

    if (result.error) {
      console.error('Database error fetching recent auditions:', result.error);
      return [];
    }

    const auditions = result.data || [];
    console.log(`Successfully fetched ${auditions.length} recent auditions`);
    
    return auditions.map((audition: any): Audition => ({
      id: audition.id,
      title: audition.title,
      description: audition.description || '',
      location: audition.location || '',
      audition_date: audition.audition_date || '',
      deadline: audition.deadline || '',
      compensation: audition.compensation || '',
      requirements: audition.requirements || '',
      status: audition.status || 'open',
      category: audition.category || '',
      experience_level: audition.experience_level || '',
      gender: audition.gender || '',
      age_range: audition.age_range || '',
      tags: audition.tags || [],
      company: 'Production Company', // Default company name
      created_at: audition.created_at || new Date().toISOString(),
      creator_id: audition.creator_id
    }));
  } catch (error: any) {
    console.error('Error in fetchRecentAuditions process:', error);
    return [];
  }
};
