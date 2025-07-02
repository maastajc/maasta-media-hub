
import { supabase } from "@/integrations/supabase/client";

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;
  
  try {
    // Upload file to storage with unique filename to avoid caching issues
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        upsert: false // Use false to create unique files and avoid cache issues
      });

    if (uploadError) throw uploadError;

    // Get public URL with cache busting
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    // Add cache busting parameter
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

    // Update profiles table with new profile picture URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        profile_picture_url: cacheBustedUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile picture URL in database:', updateError);
      throw updateError;
    }

    console.log('Profile picture uploaded successfully:', cacheBustedUrl);
    return cacheBustedUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error.message);
    throw error;
  }
};
