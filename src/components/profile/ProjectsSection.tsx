import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink, Award } from "lucide-react";

// Define valid project types based on the database enum
const PROJECT_TYPES = ["feature_film", "short_film", "web_series", "ad", "music_video", "other"] as const;

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  project_type: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: "Please select a valid project type" }) }),
  role_in_project: z.string().min(1, "Role is required"),
  year_of_release: z.number().min(1900).max(new Date().getFullYear()),
  director_producer: z.string().optional(),
  streaming_platform: z.string().optional(),
  link: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectsSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const ProjectsSection = ({ profileData, onUpdate, userId }: ProjectsSectionProps) => {
  const { toast } = useToast();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: "",
      project_type: "feature_film",
      role_in_project: "",
      year_of_release: new Date().getFullYear(),
      director_producer: "",
      streaming_platform: "",
      link: "",
    },
  });

  const projects = profileData?.projects || [];

  const resetForm = () => {
    form.reset({
      project_name: "",
      project_type: "feature_film",
      role_in_project: "",
      year_of_release: new Date().getFullYear(),
      director_producer: "",
      streaming_platform: "",
      link: "",
    });
  };

  const onSubmit = async (values: ProjectFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const projectData = {
        project_name: values.project_name,
        project_type: values.project_type,
        role_in_project: values.role_in_project,
        year_of_release: values.year_of_release,
        director_producer: values.director_producer || null,
        streaming_platform: values.streaming_platform || null,
        link: values.link || null,
        artist_id: userId,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast({ title: "Project updated successfully" });
      } else {
        const { error } = await supabase
          .from("projects")
          .insert(projectData);

        if (error) throw error;
        toast({ title: "Project added successfully" });
      }

      onUpdate();
      setIsAddingProject(false);
      setEditingProject(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    form.reset({
      project_name: project.project_name,
      project_type: project.project_type,
      role_in_project: project.role_in_project,
      year_of_release: project.year_of_release,
      director_producer: project.director_producer || "",
      streaming_platform: project.streaming_platform || "",
      link: project.link || "",
    });
    setIsAddingProject(true);
  };

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      
      toast({ title: "Project deleted successfully" });
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setIsAddingProject(false);
    setEditingProject(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
        <Button
          onClick={() => setIsAddingProject(true)}
          className="bg-maasta-purple hover:bg-maasta-purple/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Start building your portfolio by adding your first project</p>
            <Button
              onClick={() => setIsAddingProject(true)}
              className="bg-maasta-purple hover:bg-maasta-purple/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-maasta-purple transition-colors">
                    {project.project_name}
                  </h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="font-medium">Role:</span>
                    <span className="ml-1">{project.role_in_project}</span>
                  </div>

                  {project.director_producer && (
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Director:</span>
                      <span className="ml-1">{project.director_producer}</span>
                    </div>
                  )}

                  {project.streaming_platform && (
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Platform:</span>
                      <span className="ml-1">{project.streaming_platform}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Badge className="bg-maasta-purple/10 text-maasta-purple border-maasta-purple/20">
                      {project.project_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {project.year_of_release}
                    </Badge>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maasta-orange hover:text-maasta-orange/80 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddingProject} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="project_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="feature_film">Feature Film</SelectItem>
                          <SelectItem value="short_film">Short Film</SelectItem>
                          <SelectItem value="web_series">Web Series</SelectItem>
                          <SelectItem value="ad">Commercial/Ad</SelectItem>
                          <SelectItem value="music_video">Music Video</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_of_release"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Release*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2024"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role_in_project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lead Actor, Supporting Role, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="director_producer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director/Producer</FormLabel>
                    <FormControl>
                      <Input placeholder="Director or Producer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streaming_platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Streaming Platform/Channel</FormLabel>
                    <FormControl>
                      <Input placeholder="Netflix, Prime Video, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-maasta-purple hover:bg-maasta-purple/90"
                >
                  {isSaving ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsSection;
