import { supabase } from "@/integrations/supabase/client";

export interface AuditionApplication {
  id: string;
  audition_id: string;
  artist_id: string;
  status: string;
  notes: string | null;
  application_date: string;
  audition?: {
    id: string;
    title: string;
    description: string;
    location: string;
    deadline: string | null;
    audition_date: string | null;
    creator_id: string;
    status: string;
  };
  artist?: {
    id: string;
    full_name: string;
    email: string;
    profile_picture_url: string | null;
    category: string;
    experience_level: string;
  };
}

export const submitAuditionApplication = async (
  auditionId: string,
  notes: string = ""
): Promise<boolean> => {
  try {
    console.log('Submitting audition application:', auditionId, notes);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('audition_applications')
      .insert({
        audition_id: auditionId,
        artist_id: user.id,
        status: 'pending',
        notes: notes || null,
        application_date: new Date().toISOString()
      });

    if (error) {
      console.error('Error submitting application:', error);
      return false;
    }

    console.log('Successfully submitted application');
    return true;
  } catch (error: any) {
    console.error('Error in submitAuditionApplication:', error);
    return false;
  }
};

export const fetchApplicationsForCreator = async (creatorId: string): Promise<AuditionApplication[]> => {
  try {
    console.log('Fetching applications for creator:', creatorId);
    
    const { data: applications, error } = await supabase
      .from('audition_applications')
      .select(`
        *,
        auditions!inner (
          id,
          title,
          description,
          location,
          deadline,
          audition_date,
          creator_id,
          status
        ),
        artist_details!inner (
          id,
          full_name,
          email,
          profile_picture_url,
          category,
          experience_level
        )
      `)
      .eq('auditions.creator_id', creatorId)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    console.log(`Successfully fetched ${applications?.length || 0} applications`);
    return applications || [];
  } catch (error: any) {
    console.error('Error in fetchApplicationsForCreator:', error);
    throw error;
  }
};

export const fetchApplicationsForArtist = async (artistId: string): Promise<AuditionApplication[]> => {
  try {
    console.log('Fetching applications for artist:', artistId);
    
    const { data: applications, error } = await supabase
      .from('audition_applications')
      .select(`
        *,
        auditions (
          id,
          title,
          description,
          location,
          deadline,
          audition_date,
          creator_id,
          status
        )
      `)
      .eq('artist_id', artistId)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    console.log(`Successfully fetched ${applications?.length || 0} applications`);
    return applications || [];
  } catch (error: any) {
    console.error('Error in fetchApplicationsForArtist:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationId: string, 
  status: string
): Promise<boolean> => {
  try {
    console.log('Updating application status:', applicationId, status);
    
    const { error } = await supabase
      .from('audition_applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating application status:', error);
      throw new Error(`Failed to update application: ${error.message}`);
    }

    console.log('Successfully updated application status');
    return true;
  } catch (error: any) {
    console.error('Error in updateApplicationStatus:', error);
    throw error;
  }
};
