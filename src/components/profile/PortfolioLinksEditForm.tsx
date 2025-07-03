
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Artist } from "@/types/artist";

const formSchema = z.object({
  personal_website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  youtube_vimeo: z.string().url().optional().or(z.literal("")),
  imdb_profile: z.string().url().optional().or(z.literal("")),
  behance: z.string().url().optional().or(z.literal("")),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal_website: profileData.personal_website || "",
      instagram: profileData.instagram || "",
      linkedin: profileData.linkedin || "",
      youtube_vimeo: profileData.youtube_vimeo || "",
      imdb_profile: profileData.imdb_profile || "",
      behance: profileData.behance || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const updateData = {
        personal_website: values.personal_website || null,
        instagram: values.instagram || null,
        linkedin: values.linkedin || null,
        youtube_vimeo: values.youtube_vimeo || null,
        imdb_profile: values.imdb_profile || null,
        behance: values.behance || null,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Links</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="personal_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtube_vimeo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube/Vimeo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imdb_profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMDb Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://imdb.com/name/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="behance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Behance</FormLabel>
                  <FormControl>
                    <Input placeholder="https://behance.net/yourusername" {...field} />
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
