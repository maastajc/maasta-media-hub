
import { supabase } from "@/integrations/supabase/client";

interface LightweightAudition {
  id: string;
  title: string;
  description: string;
  location: string;
  audition_date: string;
  deadline: string;
  compensation: string;
  status: string;
  category: string;
  experience_level: string;
  creator_id: string;
}

export const fetchAuditionsLightweight = async (limit: number = 12): Promise<LightweightAudition[]> => {
  try {
    console.log('Fetching auditions with optimized query...');
    
    const { data, error } = await supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        location,
        audition_date,
        deadline,
        compensation,
        status,
        category,
        experience_level,
        creator_id
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Database error fetching auditions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchAuditionsLightweight:', error);
    return [];
  }
};

export const fetchAuditionById = async (id: string): Promise<LightweightAudition | null> => {
  try {
    const { data, error } = await supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        location,
        audition_date,
        deadline,
        compensation,
        status,
        category,
        experience_level,
        creator_id
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching audition:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchAuditionById:', error);
    return null;
  }
};
