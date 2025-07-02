
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  saveProject, 
  saveSkill, 
  saveEducation, 
  saveLanguage, 
  saveTool, 
  saveMediaAsset,
  deleteProject,
  deleteSkill,
  deleteEducation,
  deleteLanguage,
  deleteTool,
  deleteMediaAsset
} from '@/services/profileService';
import { saveAward, deleteAward } from '@/services/awardsService';

export const useProfileSections = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Project mutations - simplified to prevent duplicate notifications
  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveProject(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Project saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving project:', error);
      // Don't show toast here - let the component handle it to avoid duplicates
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteProject(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting project:', error);
      // Don't show toast here - let the component handle it to avoid duplicates
    },
  });

  // Skill mutations
  const saveSkillMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveSkill(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Skill saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving skill:', error);
      let errorMessage = 'Failed to save skill. Please try again.';
      
      if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        errorMessage = 'This skill already exists in your profile.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      
      toast.error(errorMessage);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteSkill(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Skill deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill. Please try again.');
    },
  });

  // Education mutations
  const saveEducationMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveEducation(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Education saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving education:', error);
      toast.error('Failed to save education. Please try again.');
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteEducation(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Education deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education. Please try again.');
    },
  });

  // Language mutations with better error handling
  const saveLanguageMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      console.log('Saving language:', data);
      return saveLanguage(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Language saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving language:', error);
      let errorMessage = 'Failed to save language. Please try again.';
      
      if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        errorMessage = 'This language is already in your profile.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('proficiency')) {
        errorMessage = 'Please select a valid proficiency level.';
      }
      
      toast.error(errorMessage);
    },
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteLanguage(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Language deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting language:', error);
      toast.error('Failed to delete language. Please try again.');
    },
  });

  // Tool mutations with better error handling
  const saveToolMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      console.log('Saving tool:', data);
      return saveTool(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Tool saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving tool:', error);
      let errorMessage = 'Failed to save tool. Please try again.';
      
      if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        errorMessage = 'This tool/software is already in your profile.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('tool_name')) {
        errorMessage = 'Please enter a valid tool name.';
      }
      
      toast.error(errorMessage);
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteTool(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Tool deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool. Please try again.');
    },
  });

  // Media asset mutations
  const saveMediaAssetMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveMediaAsset(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Media saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving media asset:', error);
      toast.error('Failed to save media. Please try again.');
    },
  });

  const deleteMediaAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteMediaAsset(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Media deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting media asset:', error);
      toast.error('Failed to delete media. Please try again.');
    },
  });

  // Award mutations using the new service
  const saveAwardMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveAward(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Award saved successfully!');
    },
    onError: (error: any) => {
      console.error('Error saving award:', error);
      toast.error('Failed to save award. Please try again.');
    },
  });

  const deleteAwardMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteAward(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Award deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting award:', error);
      toast.error('Failed to delete award. Please try again.');
    },
  });

  return {
    // State
    isSaving: saveProjectMutation.isPending || saveSkillMutation.isPending || 
              saveEducationMutation.isPending || saveLanguageMutation.isPending || 
              saveToolMutation.isPending || saveMediaAssetMutation.isPending || 
              saveAwardMutation.isPending,
    isDeleting: deleteProjectMutation.isPending || deleteSkillMutation.isPending || 
                deleteEducationMutation.isPending || deleteLanguageMutation.isPending || 
                deleteToolMutation.isPending || deleteMediaAssetMutation.isPending ||
                deleteAwardMutation.isPending,
    
    // Project functions - return the mutation directly to avoid double notifications
    saveProject: saveProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    
    // Skills functions
    saveSkill: saveSkillMutation.mutateAsync,
    deleteSkill: deleteSkillMutation.mutateAsync,
    
    // Education functions
    saveEducation: saveEducationMutation.mutateAsync,
    deleteEducation: deleteEducationMutation.mutateAsync,
    
    // Language functions
    saveLanguage: saveLanguageMutation.mutateAsync,
    deleteLanguage: deleteLanguageMutation.mutateAsync,
    
    // Tools functions
    saveTool: saveToolMutation.mutateAsync,
    deleteTool: deleteToolMutation.mutateAsync,
    
    // Media functions
    saveMediaAsset: saveMediaAssetMutation.mutateAsync,
    deleteMediaAsset: deleteMediaAssetMutation.mutateAsync,
    
    // Award functions
    saveAward: saveAwardMutation.mutateAsync,
    deleteAward: deleteAwardMutation.mutateAsync,
  };
};
