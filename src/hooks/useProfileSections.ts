
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { saveRelatedData, deleteRelatedData } from '@/services/profileService';

export const useProfileSections = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Generic mutation for saving data to any profile section
  const saveDataMutation = useMutation({
    mutationFn: async ({ table, data }: { table: string; data: any }) => {
      if (!userId) throw new Error('User ID is required');
      return saveRelatedData(table, data, userId);
    },
    onSuccess: (_, { table }) => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success(`${table.replace('_', ' ')} updated successfully`);
    },
    onError: (error: any) => {
      console.error('Error saving data:', error);
      toast.error(error.message || 'Failed to save data');
    },
  });

  // Generic mutation for deleting data
  const deleteDataMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      if (!userId) throw new Error('User ID is required');
      return deleteRelatedData(table, id, userId);
    },
    onSuccess: (_, { table }) => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success(`${table.replace('_', ' ')} deleted successfully`);
    },
    onError: (error: any) => {
      console.error('Error deleting data:', error);
      toast.error(error.message || 'Failed to delete data');
    },
  });

  // Specific functions for each section
  const saveProject = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'projects', data });

  const deleteProject = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'projects', id });

  const saveSkill = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'special_skills', data });

  const deleteSkill = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'special_skills', id });

  const saveEducation = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'education_training', data });

  const deleteEducation = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'education_training', id });

  const saveLanguage = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'language_skills', data });

  const deleteLanguage = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'language_skills', id });

  const saveTool = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'tools_software', data });

  const deleteTool = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'tools_software', id });

  const saveMediaAsset = (data: any) => 
    saveDataMutation.mutateAsync({ table: 'media_assets', data });

  const deleteMediaAsset = (id: string) => 
    deleteDataMutation.mutateAsync({ table: 'media_assets', id });

  return {
    // State
    isSaving: saveDataMutation.isPending,
    isDeleting: deleteDataMutation.isPending,
    
    // Project functions
    saveProject,
    deleteProject,
    
    // Skills functions
    saveSkill,
    deleteSkill,
    
    // Education functions
    saveEducation,
    deleteEducation,
    
    // Language functions
    saveLanguage,
    deleteLanguage,
    
    // Tools functions
    saveTool,
    deleteTool,
    
    // Media functions
    saveMediaAsset,
    deleteMediaAsset,
  };
};
