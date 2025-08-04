
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Artist, ArtistCategory, ExperienceLevel } from "@/types/artist";

const formSchema = z.object({
  category: z.enum(["actor", "director", "cinematographer", "musician", "editor", "art_director", "stunt_coordinator", "producer", "writer", "other"]).optional(),
  experience_level: z.enum(["beginner", "fresher", "intermediate", "expert", "veteran"]).optional(),
  years_of_experience: z.number().min(0).max(50).optional(),
  work_preference: z.string().optional(),
  preferred_domains: z.string().optional(),
  willing_to_relocate: z.boolean().optional(),
});

interface WorkPreferencesEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profileData: Artist;
}

const WorkPreferencesEditForm = ({ open, onClose, onSuccess, profileData }: WorkPreferencesEditFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: profileData.category as ArtistCategory,
      experience_level: profileData.experience_level as ExperienceLevel,
      years_of_experience: profileData.years_of_experience || 0,
      work_preference: profileData.work_preference || "",
      preferred_domains: profileData.preferred_domains || "",
      willing_to_relocate: profileData.willing_to_relocate || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const updateData = {
        category: values.category,
        experience_level: values.experience_level,
        years_of_experience: values.years_of_experience,
        work_preference: values.work_preference || null,
        preferred_domains: values.preferred_domains || null,
        willing_to_relocate: values.willing_to_relocate,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profileData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work preferences updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating work preferences:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update work preferences",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Work Preferences</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="actor">Actor</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="cinematographer">Cinematographer</SelectItem>
                        <SelectItem value="musician">Musician</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="art_director">Art Director</SelectItem>
                        <SelectItem value="stunt_coordinator">Stunt Coordinator</SelectItem>
                        <SelectItem value="producer">Producer</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="fresher">Fresher</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                        <SelectItem value="veteran">Veteran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="years_of_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferred_domains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available For</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Films, TV Shows, Commercials..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="willing_to_relocate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Willing to relocate</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-maasta-orange hover:bg-maasta-orange/90"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onClose();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkPreferencesEditForm;
