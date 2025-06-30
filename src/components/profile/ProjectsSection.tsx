
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Film, ExternalLink, Save } from "lucide-react";
import { useProfileSections } from "@/hooks/useProfileSections";
import { useToast } from "@/hooks/use-toast";
import { Artist } from "@/types/artist";

interface ProjectsSectionProps {
  profileData: Artist | null;
  onUpdate: () => void;
  userId?: string;
}

const ProjectsSection = ({ profileData, onUpdate, userId }: ProjectsSectionProps) => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    project_name: "",
    role_in_project: "",
    project_type: "",
    director_producer: "",
    year_of_release: "",
    streaming_platform: "",
    link: "",
  });

  const { saveProject, deleteProject, isSaving, isDeleting } = useProfileSections(userId);
  const { toast } = useToast();

  const projectTypes = [
    { value: "film", label: "Film" },
    { value: "tv_series", label: "TV Series" },
    { value: "web_series", label: "Web Series" },
    { value: "short_film", label: "Short Film" },
    { value: "documentary", label: "Documentary" },
    { value: "commercial", label: "Commercial" },
    { value: "music_video", label: "Music Video" },
    { value: "theater", label: "Theater" },
    { value: "other", label: "Other" },
  ];

  const handleSave = async () => {
    if (!formData.project_name || !formData.role_in_project || !formData.project_type) {
      toast({
        title: "❌ Missing required fields",
        description: "Please fill in project name, role, and project type.",
        variant: "destructive"
      });
      return;
    }

    try {
      const projectData = {
        ...formData,
        year_of_release: formData.year_of_release ? parseInt(formData.year_of_release) : null,
        id: editingProject?.id || undefined,
      };

      console.log('Saving project:', projectData);
      await saveProject(projectData);
      
      toast({
        title: "✅ Project saved successfully!",
        description: `"${formData.project_name}" has been ${editingProject ? 'updated' : 'added'} to your portfolio.`,
      });

      // Reset form and close dialog
      setFormData({
        project_name: "",
        role_in_project: "",
        project_type: "",
        director_producer: "",
        year_of_release: "",
        streaming_platform: "",
        link: "",
      });
      setShowAddProject(false);
      setEditingProject(null);
      onUpdate();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "❌ Failed to save project",
        description: error.message || "There was an error saving your project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name || "",
      role_in_project: project.role_in_project || "",
      project_type: project.project_type || "",
      director_producer: project.director_producer || "",
      year_of_release: project.year_of_release?.toString() || "",
      streaming_platform: project.streaming_platform || "",
      link: project.link || "",
    });
    setShowAddProject(true);
  };

  const handleDelete = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;

    try {
      await deleteProject(projectId);
      toast({
        title: "✅ Project deleted",
        description: `"${projectName}" has been removed from your portfolio.`,
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "❌ Failed to delete project",
        description: error.message || "There was an error deleting the project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      project_name: "",
      role_in_project: "",
      project_type: "",
      director_producer: "",
      year_of_release: "",
      streaming_platform: "",
      link: "",
    });
    setEditingProject(null);
    setShowAddProject(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Projects & Portfolio</h3>
        <Button 
          onClick={() => setShowAddProject(true)}
          className="bg-maasta-purple hover:bg-maasta-purple/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileData?.projects?.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{project.project_name}</CardTitle>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {project.project_type?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(project)}
                    className="text-gray-600 hover:text-maasta-purple"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(project.id, project.project_name)}
                    className="text-gray-600 hover:text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-maasta-purple">{project.role_in_project}</p>
              </div>
              
              {project.director_producer && (
                <div className="flex items-center text-sm text-gray-600">
                  <Film className="w-4 h-4 mr-2" />
                  <span>{project.director_producer}</span>
                </div>
              )}
              
              {project.year_of_release && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{project.year_of_release}</span>
                </div>
              )}
              
              {project.streaming_platform && (
                <div>
                  <Badge variant="secondary" className="text-xs">
                    {project.streaming_platform}
                  </Badge>
                </div>
              )}
              
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-maasta-orange hover:underline"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Project
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!profileData?.projects || profileData.projects.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Showcase your work by adding your film, TV, and theater projects.
            </p>
            <Button 
              onClick={() => setShowAddProject(true)}
              className="bg-maasta-purple hover:bg-maasta-purple/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Project Dialog */}
      <Dialog open={showAddProject} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <Label htmlFor="role_in_project">Your Role *</Label>
                <Input
                  id="role_in_project"
                  value={formData.role_in_project}
                  onChange={(e) => setFormData({ ...formData, role_in_project: e.target.value })}
                  placeholder="e.g., Lead Actor, Supporting Actor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_type">Project Type *</Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="year_of_release">Year of Release</Label>
                <Input
                  id="year_of_release"
                  type="number"
                  value={formData.year_of_release}
                  onChange={(e) => setFormData({ ...formData, year_of_release: e.target.value })}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="director_producer">Director/Producer</Label>
              <Input
                id="director_producer"
                value={formData.director_producer}
                onChange={(e) => setFormData({ ...formData, director_producer: e.target.value })}
                placeholder="Enter director or producer name"
              />
            </div>

            <div>
              <Label htmlFor="streaming_platform">Streaming Platform/Channel</Label>
              <Input
                id="streaming_platform"
                value={formData.streaming_platform}
                onChange={(e) => setFormData({ ...formData, streaming_platform: e.target.value })}
                placeholder="Netflix, Amazon Prime, Disney+, etc."
              />
            </div>

            <div>
              <Label htmlFor="link">Project Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90 text-white"
              >
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingProject ? "Update Project" : "Save Project"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsSection;
