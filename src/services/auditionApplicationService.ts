
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AuditionApplication {
  id: string;
  audition_id: string;
  artist_id: string;
  status: string;
  notes?: string;
  application_date: string;
  artist?: {
    full_name: string;
    email: string;
    profile_picture_url?: string;
  };
}

export const submitAuditionApplication = async (
  auditionId: string,
  notes?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to apply for auditions");
      return false;
    }

    // Check if user already applied
    const { data: existingApplication } = await supabase
      .from('audition_applications')
      .select('id')
      .eq('audition_id', auditionId)
      .eq('artist_id', user.id)
      .single();

    if (existingApplication) {
      toast.error("You have already applied for this audition");
      return false;
    }

    const { error } = await supabase
      .from('audition_applications')
      .insert({
        audition_id: auditionId,
        artist_id: user.id,
        notes: notes || '',
        status: 'pending'
      });

    if (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
      return false;
    }

    toast.success("Application submitted successfully!");
    return true;
  } catch (error) {
    console.error("Error submitting application:", error);
    toast.error("Failed to submit application");
    return false;
  }
};

export const checkApplicationStatus = async (
  auditionId: string
): Promise<AuditionApplication | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('audition_applications')
      .select('*')
      .eq('audition_id', auditionId)
      .eq('artist_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking application status:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Error checking application status:", error);
    return null;
  }
};
