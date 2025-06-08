
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

export const useProfileSections = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Project mutations
  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!userId) throw new Error('User ID is required');
      return saveProject(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteProject(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
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
      toast.success('Skill updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving skill:', error);
      toast.error(error.message || 'Failed to save skill');
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteSkill(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Skill deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting skill:', error);
      toast.error(error.message || 'Failed to delete skill');
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
      toast.success('Education updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving education:', error);
      toast.error(error.message || 'Failed to save education');
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteEducation(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Education deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting education:', error);
      toast.error(error.message || 'Failed to delete education');
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
      toast.success('Language updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving language:', error);
      toast.error(error.message || 'Failed to save language');
    },
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteLanguage(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Language deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting language:', error);
      toast.error(error.message || 'Failed to delete language');
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
      toast.success('Tool updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving tool:', error);
      toast.error(error.message || 'Failed to save tool');
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteTool(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Tool deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting tool:', error);
      toast.error(error.message || 'Failed to delete tool');
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
      toast.success('Media asset updated successfully');
    },
    onError: (error: any) => {
      console.error('Error saving media asset:', error);
      toast.error(error.message || 'Failed to save media asset');
    },
  });

  const deleteMediaAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteMediaAsset(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      toast.success('Media asset deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting media asset:', error);
      toast.error(error.message || 'Failed to delete media asset');
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
