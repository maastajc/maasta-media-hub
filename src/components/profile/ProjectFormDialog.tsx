
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileSections } from "@/hooks/useProfileSections";
import { Project } from "@/types/artist";
import { toast } from "sonner";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
  userId?: string;
}

const PROJECT_TYPES = [
  { value: 'feature_film', label: 'Feature Film' },
  { value: 'short_film', label: 'Short Film' },
  { value: 'web_series', label: 'Web Series' },
  { value: 'tv_show', label: 'TV Show' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'ad', label: 'Advertisement' },
  { value: 'music_video', label: 'Music Video' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'theater', label: 'Theater' },
  { value: 'other', label: 'Other' }
];

const ProjectFormDialog = ({ open, onClose, onSuccess, project, userId }: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState({
    project_name: '',
    role_in_project: '',
    project_type: 'feature_film',
    year_of_release: '',
    director_producer: '',
    streaming_platform: '',
    link: '',
    description: ''
  });

  const { saveProject, isSaving } = useProfileSections(userId);

  useEffect(() => {
    if (project) {
      setFormData({
        project_name: project.project_name || '',
        role_in_project: project.role_in_project || '',
        project_type: project.project_type || 'feature_film',
        year_of_release: project.year_of_release?.toString() || '',
        director_producer: project.director_producer || '',
        streaming_platform: project.streaming_platform || '',
        link: project.link || '',
        description: project.description || ''
      });
    } else {
      setFormData({
        project_name: '',
        role_in_project: '',
        project_type: 'feature_film',
        year_of_release: '',
        director_producer: '',
        streaming_platform: '',
        link: '',
        description: ''
      });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('You must be logged in to save projects');
      return;
    }

    try {
      const projectData = {
        ...formData,
        year_of_release: formData.year_of_release ? parseInt(formData.year_of_release) : null,
        id: project?.id
      };

      await saveProject(projectData);
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                value={formData.project_name}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_in_project">Your Role *</Label>
              <Input
                id="role_in_project"
                value={formData.role_in_project}
                onChange={(e) => handleInputChange('role_in_project', e.target.value)}
                placeholder="e.g., Lead Actor, Supporting Actor"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type *</Label>
              <Select
                value={formData.project_type}
                onValueChange={(value) => handleInputChange('project_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_of_release">Year of Release</Label>
              <Input
                id="year_of_release"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                value={formData.year_of_release}
                onChange={(e) => handleInputChange('year_of_release', e.target.value)}
                placeholder="e.g., 2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your role, the project, or your experience..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director_producer">Director/Producer</Label>
            <Input
              id="director_producer"
              value={formData.director_producer}
              onChange={(e) => handleInputChange('director_producer', e.target.value)}
              placeholder="Enter director or producer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streaming_platform">Streaming Platform/Channel</Label>
            <Input
              id="streaming_platform"
              value={formData.streaming_platform}
              onChange={(e) => handleInputChange('streaming_platform', e.target.value)}
              placeholder="e.g., Netflix, Amazon Prime, Star Plus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Project Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
