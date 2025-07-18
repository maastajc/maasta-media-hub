
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  
  // Project mutations
  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveProject(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Project saved successfully!',
        description: 'Your project has been updated in your portfolio.',
      });
    },
    onError: (error: any) => {
      console.error('Error saving project:', error);
      toast({
        title: '❌ Failed to save project',
        description: error.message || 'Failed to save project. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteProject(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Project deleted',
        description: 'Project has been removed from your portfolio.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting project:', error);
      toast({
        title: '❌ Failed to delete project',
        description: error.message || 'Failed to delete project. Please try again.',
        variant: 'destructive'
      });
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
      toast({
        title: '✅ Skill saved successfully!',
        description: 'Your skill has been updated in your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error saving skill:', error);
      let errorMessage = 'Failed to save skill. Please try again.';
      
      if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        errorMessage = 'This skill already exists in your profile.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      
      toast({
        title: '❌ Failed to save skill',
        description: errorMessage,
        variant: 'destructive'
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteSkill(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Skill deleted',
        description: 'Skill has been removed from your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting skill:', error);
      toast({
        title: '❌ Failed to delete skill',
        description: error.message || 'Failed to delete skill. Please try again.',
        variant: 'destructive'
      });
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
      toast({
        title: '✅ Education saved successfully!',
        description: 'Your education has been updated in your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error saving education:', error);
      toast({
        title: '❌ Failed to save education',
        description: error.message || 'Failed to save education. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteEducation(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Education deleted',
        description: 'Education has been removed from your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting education:', error);
      toast({
        title: '❌ Failed to delete education',
        description: error.message || 'Failed to delete education. Please try again.',
        variant: 'destructive'
      });
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
      toast({
        title: '✅ Language saved successfully!',
        description: 'Your language skill has been updated in your profile.',
      });
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
      
      toast({
        title: '❌ Failed to save language',
        description: errorMessage,
        variant: 'destructive'
      });
    },
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteLanguage(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Language deleted',
        description: 'Language has been removed from your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting language:', error);
      toast({
        title: '❌ Failed to delete language',
        description: error.message || 'Failed to delete language. Please try again.',
        variant: 'destructive'
      });
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
      toast({
        title: '✅ Tool saved successfully!',
        description: 'Your tool/software has been updated in your profile.',
      });
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
      
      toast({
        title: '❌ Failed to save tool',
        description: errorMessage,
        variant: 'destructive'
      });
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteTool(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Tool deleted',
        description: 'Tool/software has been removed from your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting tool:', error);
      toast({
        title: '❌ Failed to delete tool',
        description: error.message || 'Failed to delete tool. Please try again.',
        variant: 'destructive'
      });
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
      toast({
        title: '✅ Media asset saved successfully!',
        description: 'Your media has been updated in your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error saving media asset:', error);
      toast({
        title: '❌ Failed to save media asset',
        description: error.message || 'Failed to save media asset. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const deleteMediaAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteMediaAsset(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast({
        title: '✅ Media asset deleted',
        description: 'Media has been removed from your profile.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting media asset:', error);
      toast({
        title: '❌ Failed to delete media asset',
        description: error.message || 'Failed to delete media asset. Please try again.',
        variant: 'destructive'
      });
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
      queryClient.invalidateQueries({ queryKey: ['artist-profile', userId] });
    },
    onError: (error: any) => {
      console.error('Error saving award:', error);
      throw error; // Let the component handle the error and toast
    },
  });

  const deleteAwardMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteAward(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['artist-profile', userId] });
    },
    onError: (error: any) => {
      console.error('Error deleting award:', error);
      throw error; // Let the component handle the error and toast
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
    
    // Project functions - prevent double notifications
    saveProject: async (data: any) => {
      await saveProjectMutation.mutateAsync(data);
    },
    deleteProject: async (id: string) => {
      await deleteProjectMutation.mutateAsync(id);
    },
    
    // Skills functions - prevent double notifications
    saveSkill: async (data: any) => {
      await saveSkillMutation.mutateAsync(data);
    },
    deleteSkill: async (id: string) => {
      await deleteSkillMutation.mutateAsync(id);
    },
    
    // Education functions - prevent double notifications
    saveEducation: async (data: any) => {
      await saveEducationMutation.mutateAsync(data);
    },
    deleteEducation: async (id: string) => {
      await deleteEducationMutation.mutateAsync(id);
    },
    
    // Language functions - prevent double notifications
    saveLanguage: async (data: any) => {
      await saveLanguageMutation.mutateAsync(data);
    },
    deleteLanguage: async (id: string) => {
      await deleteLanguageMutation.mutateAsync(id);
    },
    
    // Tools functions - prevent double notifications
    saveTool: async (data: any) => {
      await saveToolMutation.mutateAsync(data);
    },
    deleteTool: async (id: string) => {
      await deleteToolMutation.mutateAsync(id);
    },
    
    // Media functions - prevent double notifications
    saveMediaAsset: async (data: any) => {
      await saveMediaAssetMutation.mutateAsync(data);
    },
    deleteMediaAsset: async (id: string) => {
      await deleteMediaAssetMutation.mutateAsync(id);
    },
    
    // Award functions - prevent double notifications
    saveAward: async (data: any) => {
      await saveAwardMutation.mutateAsync(data);
    },
    deleteAward: async (id: string) => {
      await deleteAwardMutation.mutateAsync(id);
    },
  };
};
