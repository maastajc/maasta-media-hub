
import { supabase } from "@/integrations/supabase/client";

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;
  
  try {
    // Upload file to storage
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

    // Update profiles table with new profile picture URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profile_picture_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile picture URL in database:', updateError);
    }

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error.message);
    throw error;
  }
};
