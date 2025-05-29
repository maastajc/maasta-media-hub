
import { supabase } from "@/integrations/supabase/client";

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;
  
  try {
    // Upload file to storage using standardized bucket name
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error.message);
    throw error;
  }
};

export const deleteProfileImage = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('profile-pictures')
      .remove([`${userId}/profile.jpg`, `${userId}/profile.png`, `${userId}/profile.jpeg`]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting profile image:', error.message);
    throw error;
  }
};
