
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import { Project } from "@/types/artist";
import ProjectFormDialog from "./ProjectFormDialog";

interface ProjectsSectionProps {
  projects: Project[];
  onUpdate: () => void;
  canEdit?: boolean;
  userId?: string;
}

const ProjectsSection = ({ projects, onUpdate, canEdit = false, userId }: ProjectsSectionProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const formatProjectType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingProject(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    onUpdate();
  };

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            Projects
          </CardTitle>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="h-8 px-2"
            >
              <Plus size={16} />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No projects added yet.</p>
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                className="mt-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            )}
          </div>
        </CardContent>
        
        {/* Add Project Dialog */}
        {canEdit && (
          <ProjectFormDialog
            open={showAddDialog || !!editingProject}
            onClose={handleCloseDialog}
            onSuccess={handleSuccess}
            project={editingProject}
            userId={userId}
          />
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🎬</span>
          Projects ({projects.length})
        </CardTitle>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="h-8 px-2"
          >
            <Plus size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{project.project_name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {formatProjectType(project.project_type)}
                    </Badge>
                    {project.year_of_release && (
                      <Badge variant="secondary" className="text-xs">
                        {project.year_of_release}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Role: <span className="font-medium">{project.role_in_project}</span>
                  </p>
                </div>
                {canEdit && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 size={14} />
                    </Button>
                  </div>
                )}
              </div>

              {project.project_description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {project.project_description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {project.director_producer && (
                  <div>
                    <span className="text-gray-500">Director/Producer:</span>
                    <span className="ml-2 font-medium">{project.director_producer}</span>
                  </div>
                )}
                {project.streaming_platform && (
                  <div>
                    <span className="text-gray-500">Platform:</span>
                    <span className="ml-2 font-medium">{project.streaming_platform}</span>
                  </div>
                )}
              </div>

              {project.link && (
                <div className="mt-3 pt-3 border-t">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-maasta-orange hover:text-maasta-orange/80 transition-colors"
                  >
                    <ExternalLink size={14} />
                    View Project
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Add/Edit Project Dialog */}
      {canEdit && (
        <ProjectFormDialog
          open={showAddDialog || !!editingProject}
          onClose={handleCloseDialog}
          onSuccess={handleSuccess}
          project={editingProject}
          userId={userId}
        />
      )}
    </Card>
  );
};

export default ProjectsSection;
