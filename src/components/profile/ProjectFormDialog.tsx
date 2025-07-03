
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/artist";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  role_in_project: z.string().min(1, "Role is required"),
  project_type: z.string().min(1, "Project type is required"),
  project_description: z.string().optional(),
  director_producer: z.string().optional(),
  streaming_platform: z.string().optional(),
  year_of_release: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
  userId?: string;
}

const ProjectFormDialog = ({ open, onClose, onSuccess, project, userId }: ProjectFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!project;

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: project?.project_name || "",
      role_in_project: project?.role_in_project || "",
      project_type: project?.project_type || "",
      project_description: project?.project_description || "",
      director_producer: project?.director_producer || "",
      streaming_platform: project?.streaming_platform || "",
      year_of_release: project?.year_of_release || undefined,
      link: project?.link || "",
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!userId) return;

    try {
      setIsSubmitting(true);

      const projectData = {
        project_name: data.project_name,
        role_in_project: data.role_in_project,
        project_type: data.project_type,
        artist_id: userId,
        year_of_release: data.year_of_release || null,
        link: data.link || null,
        director_producer: data.director_producer || null,
        streaming_platform: data.streaming_platform || null,
        project_description: data.project_description || null,
      };

      if (isEditing && project) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (error) throw error;
        toast.success("Project updated successfully!");
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success("Project added successfully!");
      }

      reset();
      onSuccess();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !userId) return;

    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .eq('artist_id', userId);

      if (error) throw error;

      toast.success("Project deleted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                {...register("project_name")}
                className="mt-1"
                placeholder="Enter project name"
              />
              {errors.project_name && (
                <p className="text-sm text-red-600 mt-1">{errors.project_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role_in_project">Your Role *</Label>
              <Input
                id="role_in_project"
                {...register("role_in_project")}
                className="mt-1"
                placeholder="e.g., Lead Actor, Director"
              />
              {errors.role_in_project && (
                <p className="text-sm text-red-600 mt-1">{errors.role_in_project.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_type">Project Type *</Label>
              <Select value={watch("project_type")} onValueChange={(value) => setValue("project_type", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature_film">Feature Film</SelectItem>
                  <SelectItem value="short_film">Short Film</SelectItem>
                  <SelectItem value="web_series">Web Series</SelectItem>
                  <SelectItem value="tv_show">TV Show</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="music_video">Music Video</SelectItem>
                  <SelectItem value="theater">Theater</SelectItem>
                  <SelectItem value="ad">Advertisement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.project_type && (
                <p className="text-sm text-red-600 mt-1">{errors.project_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="year_of_release">Year of Release</Label>
              <Input
                id="year_of_release"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                {...register("year_of_release", { valueAsNumber: true })}
                className="mt-1"
                placeholder="e.g., 2023"
              />
              {errors.year_of_release && (
                <p className="text-sm text-red-600 mt-1">{errors.year_of_release.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="project_description">Project Description</Label>
            <Textarea
              id="project_description"
              {...register("project_description")}
              className="mt-1"
              rows={4}
              placeholder="Describe the project, your experience, and your contributions..."
            />
            {errors.project_description && (
              <p className="text-sm text-red-600 mt-1">{errors.project_description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="director_producer">Director/Producer</Label>
              <Input
                id="director_producer"
                {...register("director_producer")}
                className="mt-1"
                placeholder="Name of director or producer"
              />
            </div>

            <div>
              <Label htmlFor="streaming_platform">Platform/Channel</Label>
              <Input
                id="streaming_platform"
                {...register("streaming_platform")}
                className="mt-1"
                placeholder="e.g., Netflix, Disney+, YouTube"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link">Project Link</Label>
            <Input
              id="link"
              {...register("link")}
              className="mt-1"
              placeholder="https://... (optional)"
            />
            {errors.link && (
              <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete Project
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-maasta-orange hover:bg-maasta-orange/90"
              >
                {isSubmitting ? "Saving..." : (isEditing ? "Update Project" : "Add Project")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
