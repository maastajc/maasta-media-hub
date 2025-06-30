
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Instagram, Linkedin, Youtube, Save, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

interface SocialLinksFormProps {
  profileData: Artist | null;
  onUpdate: () => void;
  userId?: string;
}

const SocialLinksForm = ({ profileData, onUpdate, userId }: SocialLinksFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    personal_website: profileData?.personal_website || "",
    instagram: profileData?.instagram || "",
    linkedin: profileData?.linkedin || "",
    youtube_vimeo: profileData?.youtube_vimeo || "",
    imdb_profile: profileData?.imdb_profile || "",
  });
  const { toast } = useToast();

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "❌ Error",
        description: "User ID is required to save social links.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          personal_website: formData.personal_website || null,
          instagram: formData.instagram || null,
          linkedin: formData.linkedin || null,
          youtube_vimeo: formData.youtube_vimeo || null,
          imdb_profile: formData.imdb_profile || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "✅ Social links updated successfully!",
        description: "Your social media links have been saved to your profile.",
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error saving social links:', error);
      toast({
        title: "❌ Failed to save social links",
        description: error.message || "There was an error saving your social links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const socialLinks = [
    {
      key: 'personal_website' as keyof typeof formData,
      label: 'Personal Website',
      icon: Globe,
      placeholder: 'https://yourwebsite.com',
      description: 'Your personal or professional website'
    },
    {
      key: 'instagram' as keyof typeof formData,
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourusername',
      description: 'Your Instagram profile'
    },
    {
      key: 'linkedin' as keyof typeof formData,
      label: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'https://linkedin.com/in/yourusername',
      description: 'Your LinkedIn profile'
    },
    {
      key: 'youtube_vimeo' as keyof typeof formData,
      label: 'YouTube/Vimeo',
      icon: Youtube,
      placeholder: 'https://youtube.com/channel/yourchannel',
      description: 'Your YouTube channel or Vimeo profile'
    },
    {
      key: 'imdb_profile' as keyof typeof formData,
      label: 'IMDb Profile',
      icon: ExternalLink,
      placeholder: 'https://imdb.com/name/nm1234567',  
      description: 'Your IMDb profile page'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Social Links & Online Presence</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Your Online Profiles</CardTitle>
          <p className="text-sm text-gray-600">
            Add your social media and professional profiles to help people connect with you.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            const currentValue = formData[link.key];
            const isValidUrl = validateUrl(currentValue);
            
            return (
              <div key={link.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <Label htmlFor={link.key} className="font-medium">
                    {link.label}
                  </Label>
                </div>
                <Input
                  id={link.key}
                  type="url"
                  value={currentValue}
                  onChange={(e) => setFormData({ ...formData, [link.key]: e.target.value })}
                  placeholder={link.placeholder}
                  className={!isValidUrl && currentValue ? "border-red-300" : ""}
                />
                <p className="text-xs text-gray-500">{link.description}</p>
                {!isValidUrl && currentValue && (
                  <p className="text-xs text-red-500">Please enter a valid URL</p>
                )}
                {currentValue && isValidUrl && (
                  <a
                    href={formatUrl(currentValue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-maasta-orange hover:underline"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Preview link
                  </a>
                )}
              </div>
            );
          })}

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving || Object.values(formData).some((value, index) => 
                value && !validateUrl(value)
              )}
              className="bg-maasta-purple hover:bg-maasta-purple/90 text-white"
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Social Links
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Links Preview */}
      {Object.values(formData).some(value => value) && (
        <Card>
          <CardHeader>
            <CardTitle>Link Preview</CardTitle>
            <p className="text-sm text-gray-600">
              How your links will appear on your public profile:
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                const currentValue = formData[link.key];
                
                if (!currentValue || !validateUrl(currentValue)) return null;
                
                return (
                  <a
                    key={link.key}
                    href={formatUrl(currentValue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300"
                    title={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialLinksForm;
