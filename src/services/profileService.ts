
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

// Helper function to ensure artist_details record exists
export const ensureArtistDetailsExists = async (userId: string): Promise<void> => {
  try {
    // Check if artist_details record exists
    const { data: existingArtist, error: checkError } = await supabase
      .from('artist_details')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking artist_details:', checkError);
      throw checkError;
    }

    // If no record exists, create one from auth user data
    if (!existingArtist) {
      console.log('Creating missing artist_details record for user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('artist_details')
        .insert({
          id: userId,
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'New User',
          email: user?.email || '',
          role: 'artist',
          category: 'actor',
          experience_level: 'beginner',
          years_of_experience: 0,
          status: 'active'
        });

      if (insertError) {
        console.error('Error creating artist_details record:', insertError);
        throw insertError;
      }
      
      console.log('Successfully created artist_details record');
    }
  } catch (error: any) {
    console.error('Error in ensureArtistDetailsExists:', error);
    throw error;
  }
};

// Generic function to save related data (projects, skills, etc.)
export const saveRelatedData = async (
  table: string,
  data: any,
  userId: string
): Promise<any> => {
  try {
    // Ensure artist_details record exists first
    await ensureArtistDetailsExists(userId);

    // Add artist_id to the data
    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    let result;
    if (data.id) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      result = updatedData;
    } else {
      // Insert new record
      const { data: newData, error } = await supabase
        .from(table)
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      result = newData;
    }

    return result;
  } catch (error: any) {
    console.error(`Error saving ${table} data:`, error);
    throw error;
  }
};

// Function to delete related data
export const deleteRelatedData = async (
  table: string,
  id: string,
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error(`Error deleting ${table} data:`, error);
    throw error;
  }
};
