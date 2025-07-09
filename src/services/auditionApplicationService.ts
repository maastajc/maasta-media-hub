import { supabase } from "@/integrations/supabase/client";

export interface AuditionApplication {
  id: string;
  audition_id: string;
  artist_id: string;
  status: string;
  notes: string | null;
  organizer_notes?: string | null;
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
    personal_website?: string | null;
    linkedin?: string | null;
    youtube_vimeo?: string | null;
    phone_number?: string | null;
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
    
    // First, get auditions created by this user
    const { data: auditions, error: auditionsError } = await supabase
      .from('auditions')
      .select('id, title, description, location, deadline, audition_date, creator_id, status')
      .eq('creator_id', creatorId);

    if (auditionsError) {
      console.error('Error fetching auditions:', auditionsError);
      throw new Error(`Failed to fetch auditions: ${auditionsError.message}`);
    }

    if (!auditions || auditions.length === 0) {
      console.log('No auditions found for creator');
      return [];
    }

    const auditionIds = auditions.map(a => a.id);

    // Then get applications for those auditions
    const { data: applications, error: applicationsError } = await supabase
      .from('audition_applications')
      .select('*')
      .in('audition_id', auditionIds)
      .order('application_date', { ascending: false });

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
      throw new Error(`Failed to fetch applications: ${applicationsError.message}`);
    }

    if (!applications || applications.length === 0) {
      console.log('No applications found');
      return [];
    }

    // Get artist profiles for the applications
    const artistIds = [...new Set(applications.map(app => app.artist_id))];
    const { data: artists, error: artistsError } = await supabase
      .from('profiles')
      .select('id, full_name, email, profile_picture_url, category, experience_level, personal_website, linkedin, youtube_vimeo, phone_number')
      .in('id', artistIds);

    if (artistsError) {
      console.error('Error fetching artists:', artistsError);
      // Continue without artist data rather than failing completely
    }

    // Combine the data
    const applicationsWithDetails = applications.map(app => {
      const audition = auditions.find(a => a.id === app.audition_id);
      const artist = artists?.find(a => a.id === app.artist_id);

      return {
        id: app.id,
        audition_id: app.audition_id,
        artist_id: app.artist_id,
        status: app.status,
        notes: app.notes,
        organizer_notes: app.organizer_notes,
        application_date: app.application_date,
        audition: audition ? {
          id: audition.id,
          title: audition.title,
          description: audition.description || '',
          location: audition.location,
          deadline: audition.deadline,
          audition_date: audition.audition_date,
          creator_id: audition.creator_id,
          status: audition.status
        } : undefined,
        artist: artist ? {
          id: artist.id,
          full_name: artist.full_name,
          email: artist.email,
          profile_picture_url: artist.profile_picture_url,
          category: artist.category,
          experience_level: artist.experience_level,
          personal_website: artist.personal_website,
          linkedin: artist.linkedin,
          youtube_vimeo: artist.youtube_vimeo,
          phone_number: artist.phone_number
        } : undefined
      };
    });

    console.log(`Successfully fetched ${applicationsWithDetails.length} applications with details`);
    return applicationsWithDetails;
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

export const updateApplicationNotes = async (
  applicationId: string,
  notes: string
): Promise<boolean> => {
  try {
    console.log('Updating application notes:', applicationId, notes);
    
    const { error } = await supabase
      .from('audition_applications')
      .update({ organizer_notes: notes })
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating application notes:', error);
      throw new Error(`Failed to update notes: ${error.message}`);
    }

    console.log('Successfully updated application notes');
    return true;
  } catch (error: any) {
    console.error('Error in updateApplicationNotes:', error);
    throw error;
  }
};
