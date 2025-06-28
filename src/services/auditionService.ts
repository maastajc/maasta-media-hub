
import { supabase } from "@/integrations/supabase/client";

export const fetchAuditions = async () => {
  try {
    console.log('Fetching auditions...');
    
    const { data, error } = await supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        location,
        deadline,
        audition_date,
        creator_id,
        status,
        category,
        experience_level,
        gender,
        age_range,
        compensation,
        requirements,
        project_details,
        tags,
        created_at,
        updated_at
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auditions:', error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} auditions`);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchAuditions:', error);
    throw error;
  }
};

export const fetchRecentAuditions = async () => {
  try {
    console.log('Fetching recent auditions...');
    
    const { data, error } = await supabase
      .from('auditions')
      .select(`
        id,
        title,
        description,
        location,
        deadline,
        audition_date,
        creator_id,
        status,
        category,
        experience_level,
        gender,
        age_range,
        compensation,
        requirements,
        project_details,
        tags,
        created_at,
        updated_at
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching recent auditions:', error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} recent auditions`);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchRecentAuditions:', error);
    throw error;
  }
};

export const fetchAuditionById = async (id: string) => {
  try {
    console.log('Fetching audition by id:', id);
    
    const { data, error } = await supabase
      .from('auditions')
      .select(`
        *,
        profiles!creator_id (
          id,
          full_name,
          email,
          profile_picture_url
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching audition by id:', error);
      throw error;
    }

    if (!data) {
      console.log('No audition found with id:', id);
      return null;
    }

    console.log('Successfully fetched audition:', data.title);
    return data;
  } catch (error: any) {
    console.error('Error in fetchAuditionById:', error);
    throw error;
  }
};
