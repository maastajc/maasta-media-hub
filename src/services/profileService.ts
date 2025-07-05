
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

// Define the valid table names as a union type
type ValidTableName = 
  | "projects" 
  | "special_skills" 
  | "education_training" 
  | "language_skills" 
  | "tools_software" 
  | "media_assets";

// Helper function to ensure artist profile record exists
export const ensureProfileExists = async (userId: string): Promise<void> => {
  try {
    // Check if profile record exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking profile:', checkError);
      throw checkError;
    }

    // If no record exists, create one from auth user data
    if (!existingProfile) {
      console.log('Creating missing profile record for user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not found");

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
          email: user.email || '',
          role: 'artist',
          category: 'actor',
          experience_level: 'beginner',
          years_of_experience: 0,
          status: 'active'
        });

      if (insertError) {
        console.error('Error creating profile record:', insertError);
        throw insertError;
      }
      
      console.log('Successfully created profile record');
    }
  } catch (error: any) {
    console.error('Error in ensureProfileExists:', error);
    throw error;
  }
};

// Specific functions for each table to avoid TypeScript issues
export const saveProject = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

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

export const saveSkill = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

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

export const saveEducation = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

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

export const saveLanguage = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

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

export const saveTool = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

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

export const saveMediaAsset = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureProfileExists(userId);

    const dataWithArtistId = {
      ...data,
      artist_id: userId
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

// Delete functions for each table
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

// Updated generic function without awards
export const saveRelatedData = async (
  table: ValidTableName,
  data: any,
  userId: string
): Promise<any> => {
  switch (table) {
    case 'projects':
      return saveProject(data, userId);
    case 'special_skills':
      return saveSkill(data, userId);
    case 'education_training':
      return saveEducation(data, userId);
    case 'language_skills':
      return saveLanguage(data, userId);
    case 'tools_software':
      return saveTool(data, userId);
    case 'media_assets':
      return saveMediaAsset(data, userId);
    default:
      throw new Error(`Unsupported table: ${table}`);
  }
};

export const deleteRelatedData = async (
  table: ValidTableName,
  id: string,
  userId: string
): Promise<void> => {
  switch (table) {
    case 'projects':
      return deleteProject(id, userId);
    case 'special_skills':
      return deleteSkill(id, userId);
    case 'education_training':
      return deleteEducation(id, userId);
    case 'language_skills':
      return deleteLanguage(id, userId);
    case 'tools_software':
      return deleteTool(id, userId);
    case 'media_assets':
      return deleteMediaAsset(id, userId);
    default:
      throw new Error(`Unsupported table: ${table}`);
  }
};
