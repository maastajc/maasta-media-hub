
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

// Helper function to ensure unified_profiles record exists
export const ensureUnifiedProfileExists = async (userId: string): Promise<void> => {
  try {
    // Check if unified_profiles record exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('unified_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking unified_profiles:', checkError);
      throw checkError;
    }

    // If no record exists, create one from auth user data
    if (!existingProfile) {
      console.log('Creating missing unified_profiles record for user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('unified_profiles')
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
        console.error('Error creating unified_profiles record:', insertError);
        throw insertError;
      }
      
      console.log('Successfully created unified_profiles record');
    }
  } catch (error: any) {
    console.error('Error in ensureUnifiedProfileExists:', error);
    throw error;
  }
};

// Profile functions
export const saveProfile = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureUnifiedProfileExists(userId);

    // Validate data before saving
    const validatedData = validateProfileData(data);
    
    const { data: updatedData, error } = await supabase
      .from('unified_profiles')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return updatedData;
  } catch (error: any) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Projects functions
export const saveProject = async (data: any, userId: string): Promise<any> => {
  try {
    await ensureUnifiedProfileExists(userId);

    // Validate project data
    const validatedData = validateProjectData(data);
    const dataWithArtistId = {
      ...validatedData,
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
    await ensureUnifiedProfileExists(userId);

    const validatedData = validateSkillData(data);
    const dataWithArtistId = {
      ...validatedData,
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
    await ensureUnifiedProfileExists(userId);

    const validatedData = validateEducationData(data);
    const dataWithArtistId = {
      ...validatedData,
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
    await ensureUnifiedProfileExists(userId);

    const validatedData = validateLanguageData(data);
    const dataWithArtistId = {
      ...validatedData,
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
    await ensureUnifiedProfileExists(userId);

    const validatedData = validateToolData(data);
    const dataWithArtistId = {
      ...validatedData,
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
    await ensureUnifiedProfileExists(userId);

    const validatedData = validateMediaData(data);
    const dataWithArtistId = {
      ...validatedData,
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

// Validation functions
const validateProfileData = (data: any) => {
  const errors: string[] = [];
  
  // Email validation
  if (data.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Phone validation
  if (data.phone_number && !/^\+?[\d\s\-\(\)\.]{10,}$/.test(data.phone_number)) {
    errors.push('Invalid phone number format. Please use a valid phone number with at least 10 digits');
  }
  
  // Date of birth validation
  if (data.date_of_birth && new Date(data.date_of_birth) > new Date()) {
    errors.push('Date of birth cannot be in the future');
  }
  
  // Experience years validation
  if (data.years_of_experience !== undefined && (data.years_of_experience < 0 || data.years_of_experience > 100)) {
    errors.push('Years of experience must be between 0 and 100');
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateProjectData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.project_name?.trim()) {
    errors.push('Project name is required');
  }
  
  if (!data.role_in_project?.trim()) {
    errors.push('Role in project is required');
  }
  
  if (!data.project_type?.trim()) {
    errors.push('Project type is required');
  }
  
  if (data.year_of_release && (data.year_of_release < 1900 || data.year_of_release > new Date().getFullYear() + 5)) {
    errors.push('Invalid year of release');
  }
  
  if (errors.length > 0) {
    throw new Error(`Project validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateSkillData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.skill?.trim()) {
    errors.push('Skill name is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Skill validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateEducationData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.qualification_name?.trim()) {
    errors.push('Qualification name is required');
  }
  
  if (data.year_completed && (data.year_completed < 1950 || data.year_completed > new Date().getFullYear() + 5)) {
    errors.push('Invalid year completed');
  }
  
  if (errors.length > 0) {
    throw new Error(`Education validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateLanguageData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.language?.trim()) {
    errors.push('Language is required');
  }
  
  if (!data.proficiency?.trim()) {
    errors.push('Proficiency level is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Language validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateToolData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.tool_name?.trim()) {
    errors.push('Tool name is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Tool validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};

const validateMediaData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.file_name?.trim()) {
    errors.push('File name is required');
  }
  
  if (!data.file_type?.trim()) {
    errors.push('File type is required');
  }
  
  if (!data.url?.trim()) {
    errors.push('File URL is required');
  }
  
  if (data.file_size !== undefined && data.file_size < 0) {
    errors.push('File size must be positive');
  }
  
  if (errors.length > 0) {
    throw new Error(`Media validation errors: ${errors.join(', ')}`);
  }
  
  return data;
};
