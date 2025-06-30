
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
      // Handle duplicate key constraint specifically
      if (error.message?.includes('duplicate key')) {
        toast({
          title: '❌ Skill already exists',
          description: 'This skill is already in your profile.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: '❌ Failed to save skill',
          description: error.message || 'Failed to save skill. Please try again.',
          variant: 'destructive'
        });
      }
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

  // Language mutations
  const saveLanguageMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
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
      // Handle duplicate key constraint specifically
      if (error.message?.includes('duplicate key')) {
        toast({
          title: '❌ Language already exists',
          description: 'This language is already in your profile.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: '❌ Failed to save language',
          description: error.message || 'Failed to save language. Please try again.',
          variant: 'destructive'
        });
      }
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

  // Tool mutations
  const saveToolMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
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
      // Handle duplicate key constraint specifically
      if (error.message?.includes('duplicate key')) {
        toast({
          title: '❌ Tool already exists',
          description: 'This tool/software is already in your profile.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: '❌ Failed to save tool',
          description: error.message || 'Failed to save tool. Please try again.',
          variant: 'destructive'
        });
      }
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

  return {
    // State
    isSaving: saveProjectMutation.isPending || saveSkillMutation.isPending || 
              saveEducationMutation.isPending || saveLanguageMutation.isPending || 
              saveToolMutation.isPending || saveMediaAssetMutation.isPending,
    isDeleting: deleteProjectMutation.isPending || deleteSkillMutation.isPending || 
                deleteEducationMutation.isPending || deleteLanguageMutation.isPending || 
                deleteToolMutation.isPending || deleteMediaAssetMutation.isPending,
    
    // Project functions
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
  };
};
