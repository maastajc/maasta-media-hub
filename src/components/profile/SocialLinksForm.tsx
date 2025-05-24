
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Instagram, Linkedin, Youtube, Film } from "lucide-react";

const socialLinksSchema = z.object({
  imdb_profile: z.string().optional(),
  youtube_vimeo: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  personal_website: z.string().optional(),
});

type SocialLinksValues = z.infer<typeof socialLinksSchema>;

interface SocialLinksFormProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const SocialLinksForm = ({ profileData, onUpdate, userId }: SocialLinksFormProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SocialLinksValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      imdb_profile: profileData?.imdb_profile || "",
      youtube_vimeo: profileData?.youtube_vimeo || "",
      instagram: profileData?.instagram || "",
      linkedin: profileData?.linkedin || "",
      personal_website: profileData?.personal_website || "",
    },
  });
  
  const onSubmit = async (values: SocialLinksValues) => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          imdb_profile: values.imdb_profile,
          youtube_vimeo: values.youtube_vimeo,
          instagram: values.instagram,
          linkedin: values.linkedin,
          personal_website: values.personal_website,
        })
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "Social links updated",
        description: "Your social media links have been updated successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      console.error("Error updating social links:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to update social links",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const socialPlatforms = [
    {
      icon: Film,
      name: "IMDB Profile",
      field: "imdb_profile" as const,
      placeholder: "https://www.imdb.com/name/...",
      color: "text-yellow-600"
    },
    {
      icon: Youtube,
      name: "YouTube/Vimeo",
      field: "youtube_vimeo" as const,
      placeholder: "Link to your channel or profile",
      color: "text-red-600"
    },
    {
      icon: Instagram,
      name: "Instagram",
      field: "instagram" as const,
      placeholder: "https://www.instagram.com/...",
      color: "text-pink-600"
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      field: "linkedin" as const,
      placeholder: "https://www.linkedin.com/in/...",
      color: "text-blue-600"
    },
    {
      icon: Globe,
      name: "Personal Website",
      field: "personal_website" as const,
      placeholder: "https://yourwebsite.com",
      color: "text-gray-600"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Media & Professional Links</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 text-maasta-purple" size={24} />
            Connect Your Online Presence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <FormField
                    key={platform.field}
                    control={form.control}
                    name={platform.field}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Icon className={`mr-2 ${platform.color}`} size={20} />
                          {platform.name}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={platform.placeholder} 
                            {...field} 
                            className="pl-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-maasta-orange hover:bg-maasta-orange/90 px-8"
                >
                  {isSaving ? "Saving..." : "Save Links"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Links Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const value = form.watch(platform.field);
              return (
                <div
                  key={platform.field}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                    value 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Icon className={`mr-3 ${platform.color}`} size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{platform.name}</p>
                    {value ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500">Not connected</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLinksForm;
