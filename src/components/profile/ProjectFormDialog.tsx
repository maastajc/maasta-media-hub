
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/artist";

const formSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  role_in_project: z.string().min(1, "Role is required"),
  project_type: z.enum(["feature_film", "short_film", "web_series", "tv_show", "commercial", "music_video", "documentary", "theater", "ad", "other"]),
  year_of_release: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  director_producer: z.string().optional(),
  streaming_platform: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
});

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
  userId?: string;
}

const ProjectFormDialog = ({ open, onClose, onSuccess, project, userId }: ProjectFormDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: project?.project_name || "",
      role_in_project: project?.role_in_project || "",
      project_type: project?.project_type || "feature_film",
      year_of_release: project?.year_of_release || undefined,
      director_producer: project?.director_producer || "",
      streaming_platform: project?.streaming_platform || "",
      link: project?.link || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        project_name: values.project_name,
        role_in_project: values.role_in_project,
        project_type: values.project_type,
        artist_id: userId,
        year_of_release: values.year_of_release || null,
        link: values.link || null,
        director_producer: values.director_producer || null,
        streaming_platform: values.streaming_platform || null,
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from("projects")
          .insert(projectData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: project ? "Project updated successfully" : "Project added successfully",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_in_project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your role in the project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="project_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="feature_film">Feature Film</SelectItem>
                        <SelectItem value="short_film">Short Film</SelectItem>
                        <SelectItem value="web_series">Web Series</SelectItem>
                        <SelectItem value="tv_show">TV Show</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="music_video">Music Video</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                        <SelectItem value="theater">Theater</SelectItem>
                        <SelectItem value="ad">Advertisement</SelectItem>
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
                    <FormLabel>Release Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="director_producer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Director/Producer</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of director or producer" {...field} />
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
                  <FormLabel>Platform/Distribution</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix, Amazon Prime, Theater, etc." {...field} />
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

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-maasta-orange hover:bg-maasta-orange/90"
              >
                {isSubmitting ? "Saving..." : project ? "Update Project" : "Add Project"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
