
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
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

  const scrollLeft = () => {
    const container = document.getElementById('projects-scroll-container');
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('projects-scroll-container');
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
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
        <div className="flex items-center gap-2">
          {projects.length > 3 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollLeft}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollRight}
                className="h-8 w-8 p-0"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div 
            id="projects-scroll-container"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-80 border rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg truncate">{project.project_name}</h3>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {formatProjectType(project.project_type)}
                      </Badge>
                      {project.year_of_release && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {project.year_of_release}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Role: <span className="font-medium">{project.role_in_project}</span>
                    </p>
                    {project.description && (
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 flex-shrink-0 ml-2">
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

                <div className="space-y-2 text-sm">
                  {project.director_producer && (
                    <div>
                      <span className="text-gray-500">Director/Producer:</span>
                      <span className="ml-2 font-medium truncate block">{project.director_producer}</span>
                    </div>
                  )}
                  {project.streaming_platform && (
                    <div>
                      <span className="text-gray-500">Platform:</span>
                      <span className="ml-2 font-medium truncate block">{project.streaming_platform}</span>
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
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
};

export default ProjectsSection;
