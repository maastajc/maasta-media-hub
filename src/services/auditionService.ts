
import { supabase } from "@/integrations/supabase/client";

const MAX_RETRIES = 2;
const RETRY_DELAY = 500;
const TIMEOUT_MS = 8000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  retryDelay: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error('Operation failed:', error.message);
    
    if (retries > 0) {
      console.log(`Retrying operation in ${retryDelay}ms... ${retries} attempts left`);
      await delay(retryDelay);
      return withRetry(operation, retries - 1, retryDelay);
    }
    
    throw error;
  }
};

export const fetchAuditions = async () => {
  return withRetry(async () => {
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
        updated_at,
        profiles!creator_id (
          id,
          full_name,
          profile_picture_url
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching auditions:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Transform the data to include posterProfile
    const transformedData = data?.map(audition => ({
      ...audition,
      posterProfile: audition.profiles ? {
        id: audition.profiles.id,
        full_name: audition.profiles.full_name,
        profile_picture: audition.profiles.profile_picture_url
      } : null
    })) || [];

    console.log(`Successfully fetched ${transformedData.length} auditions`);
    return transformedData;
  });
};

export const fetchRecentAuditions = async () => {
  return withRetry(async () => {
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
        updated_at,
        profiles!creator_id (
          id,
          full_name,
          profile_picture_url
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching recent auditions:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Transform the data to include posterProfile
    const transformedData = data?.map(audition => ({
      ...audition,
      posterProfile: audition.profiles ? {
        id: audition.profiles.id,
        full_name: audition.profiles.full_name,
        profile_picture: audition.profiles.profile_picture_url
      } : null
    })) || [];

    console.log(`Successfully fetched ${transformedData.length} recent auditions`);
    return transformedData;
  });
};

export const fetchAuditionById = async (id: string) => {
  return withRetry(async () => {
    console.log('Fetching audition by id:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid audition ID provided');
    }
    
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
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.log('No audition found with id:', id);
      return null;
    }

    console.log('Successfully fetched audition:', data.title);
    return data;
  });
};
