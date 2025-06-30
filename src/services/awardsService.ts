
import { supabase } from "@/integrations/supabase/client";
import { ensureProfileExists } from "./profileService";

export const saveAward = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('awards')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('awards')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving award:', error);
    throw error;
  }
};

export const deleteAward = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('awards')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting award:', error);
    throw error;
  }
};
