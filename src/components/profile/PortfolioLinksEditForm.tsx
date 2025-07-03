
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Artist } from "@/types/artist";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  custom_links: z.array(z.object({
    title: z.string().min(1, "Link title is required"),
    url: z.string().url("Please enter a valid URL")
  })).default([])
});

interface PortfolioLinksEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profileData: Artist;
}

const PortfolioLinksEditForm = ({ open, onClose, onSuccess, profileData }: PortfolioLinksEditFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert existing predefined links to custom format
  const getInitialLinks = () => {
    const links = [];
    if (profileData.personal_website) {
      links.push({ title: "Personal Website", url: profileData.personal_website });
    }
    if (profileData.instagram) {
      links.push({ title: "Instagram", url: profileData.instagram });
    }
    if (profileData.linkedin) {
      links.push({ title: "LinkedIn", url: profileData.linkedin });
    }
    if (profileData.youtube_vimeo) {
      links.push({ title: "YouTube/Vimeo", url: profileData.youtube_vimeo });
    }
    if (profileData.imdb_profile) {
      links.push({ title: "IMDb Profile", url: profileData.imdb_profile });
    }
    if (profileData.behance) {
      links.push({ title: "Behance", url: profileData.behance });
    }
    
    // Add any existing custom links
    if (profileData.custom_links) {
      const customLinks = Array.isArray(profileData.custom_links) 
        ? profileData.custom_links 
        : JSON.parse(profileData.custom_links as string);
      links.push(...customLinks);
    }
    
    return links.length > 0 ? links : [{ title: "", url: "" }];
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      custom_links: getInitialLinks()
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "custom_links"
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const updateData = {
        // Clear old predefined links
        personal_website: null,
        instagram: null,
        linkedin: null,
        youtube_vimeo: null,
        imdb_profile: null,
        behance: null,
        // Store new custom links
        custom_links: JSON.stringify(values.custom_links.filter(link => link.title && link.url)),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profileData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio links updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating portfolio links:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update portfolio links",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewLink = () => {
    append({ title: "", url: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Links</DialogTitle>
          <p className="text-sm text-gray-600">
            Add your custom portfolio links with personalized titles
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Link {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`custom_links.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., My Portfolio Website, Acting Reel on YouTube" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`custom_links.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://yourlink.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addNewLink}
              className="w-full flex items-center gap-2"
            >
              <Plus size={16} />
              Add Another Link
            </Button>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-maasta-orange hover:bg-maasta-orange/90"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
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

export default PortfolioLinksEditForm;
