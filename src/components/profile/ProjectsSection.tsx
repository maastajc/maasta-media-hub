
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, ExternalLink, Calendar, User } from "lucide-react";
import { useProfileSections } from "@/hooks/useProfileSections";
import { Project } from "@/types/artist";
import ProjectFormDialog from "./ProjectFormDialog";
import { toast } from "sonner";

interface ProjectsSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
  isOwnProfile?: boolean;
}

const ProjectsSection = ({ profileData, onUpdate, userId, isOwnProfile = false }: ProjectsSectionProps) => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { deleteProject, isDeleting } = useProfileSections(userId);

  const projects = profileData?.projects || [];

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowFormDialog(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteProject(projectId);
      onUpdate();
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowFormDialog(true);
  };

  const handleCloseDialog = () => {
    setShowFormDialog(false);
    setEditingProject(null);
  };

  const handleSuccess = () => {
    onUpdate();
    handleCloseDialog();
    toast.success(editingProject ? 'Project updated successfully' : 'Project added successfully');
  };

  const formatProjectType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="min-h-[500px]">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Projects ({projects.length})</CardTitle>
          {isOwnProfile && (
            <Button onClick={handleAddNew} size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Add Project
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-6 min-h-[400px]">
        {projects.length > 0 ? (
          <div className="grid gap-6">
            {projects.map((project: Project) => (
              <Card key={project.id} className="border-l-4 border-l-maasta-orange">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{project.project_name}</h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-maasta-purple hover:text-maasta-purple/80"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">
                          {formatProjectType(project.project_type)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <User size={12} />
                          {project.role_in_project}
                        </Badge>
                        {project.year_of_release && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar size={12} />
                            {project.year_of_release}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {isOwnProfile && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="text-gray-600 hover:text-maasta-purple"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={isDeleting}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {project.director_producer && (
                      <div>
                        <span className="font-medium">Director/Producer:</span>
                        <p>{project.director_producer}</p>
                      </div>
                    )}
                    {project.streaming_platform && (
                      <div>
                        <span className="font-medium">Platform:</span>
                        <p>{project.streaming_platform}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              {isOwnProfile 
                ? "Showcase your work by adding your projects and achievements." 
                : "This artist hasn't added any projects yet."
              }
            </p>
            {isOwnProfile && (
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus size={16} />
                Add Your First Project
              </Button>
            )}
          </div>
        )}

        <ProjectFormDialog
          open={showFormDialog}
          onClose={handleCloseDialog}
          onSuccess={handleSuccess}
          project={editingProject}
          userId={userId}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
