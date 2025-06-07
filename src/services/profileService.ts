
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

// Projects functions
export const saveProject = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('projects')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('projects')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Skills functions
export const saveSkill = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('special_skills')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('special_skills')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving skill:', error);
    throw error;
  }
};

export const deleteSkill = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('special_skills')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Education functions
export const saveEducation = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('education_training')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('education_training')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving education:', error);
    throw error;
  }
};

export const deleteEducation = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('education_training')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// Language functions
export const saveLanguage = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('language_skills')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('language_skills')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving language:', error);
    throw error;
  }
};

export const deleteLanguage = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('language_skills')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting language:', error);
    throw error;
  }
};

// Tools functions
export const saveTool = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('tools_software')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('tools_software')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving tool:', error);
    throw error;
  }
};

export const deleteTool = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tools_software')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting tool:', error);
    throw error;
  }
};

// Media functions
export const saveMediaAsset = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureArtistDetailsExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId,
      user_id: userId
    };

    if (data.id) {
      const { data: updatedData, error } = await supabase
        .from('media_assets')
        .update(dataWithArtistId)
        .eq('id', data.id)
        .eq('artist_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    } else {
      const { data: newData, error } = await supabase
        .from('media_assets')
        .insert(dataWithArtistId)
        .select()
        .single();
      
      if (error) throw error;
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving media asset:', error);
    throw error;
  }
};

export const deleteMediaAsset = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id)
      .eq('artist_id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting media asset:', error);
    throw error;
  }
};
