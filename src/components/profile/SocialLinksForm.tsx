
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Youtube, Save, ExternalLink, Plus, Trash2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Artist, CustomLink } from "@/types/artist";

interface SocialLinksFormProps {
  profileData: Artist | null;
  onUpdate: () => void;
  userId?: string;
}

const SocialLinksForm = ({ profileData, onUpdate, userId }: SocialLinksFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    instagram: profileData?.instagram || "",
    youtube_vimeo: profileData?.youtube_vimeo || "",
  });
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(() => {
    if (!profileData?.custom_links) return [];
    try {
      return Array.isArray(profileData.custom_links) 
        ? profileData.custom_links 
        : JSON.parse(profileData.custom_links as string);
    } catch {
      return [];
    }
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
          instagram: formData.instagram || null,
          youtube_vimeo: formData.youtube_vimeo || null,
          custom_links: JSON.stringify(customLinks.filter(link => link.title && link.url)) as any,
          // Clear old fields
          personal_website: null,
          linkedin: null,
          imdb_profile: null,
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

  const defaultSocialLinks = [
    {
      key: 'instagram' as keyof typeof formData,
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourusername',
      description: 'Your Instagram profile'
    },
    {
      key: 'youtube_vimeo' as keyof typeof formData,
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'https://youtube.com/channel/yourchannel',
      description: 'Your YouTube channel or Vimeo profile'
    }
  ];

  const addCustomLink = () => {
    if (customLinks.length < 5) {
      setCustomLinks([...customLinks, { id: Date.now().toString(), title: '', url: '' }]);
    }
  };

  const updateCustomLink = (index: number, field: 'title' | 'url', value: string) => {
    const updatedLinks = [...customLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setCustomLinks(updatedLinks);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

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
          {/* Default Social Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Default Platforms</h4>
            {defaultSocialLinks.map((link) => {
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
          </div>

          {/* Custom Links Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Custom Links</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomLink}
                disabled={customLinks.length >= 5}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Link ({customLinks.length}/5)
              </Button>
            </div>
            
            {customLinks.map((link, index) => (
              <div key={link.id || index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Custom Link {index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomLink(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`custom-title-${index}`}>Link Title</Label>
                  <Input
                    id={`custom-title-${index}`}
                    value={link.title}
                    onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                    placeholder="e.g., My Portfolio, Short Film Channel, Behance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`custom-url-${index}`}>Link URL</Label>
                  <Input
                    id={`custom-url-${index}`}
                    type="url"
                    value={link.url}
                    onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                    placeholder="https://yourlink.com"
                    className={!validateUrl(link.url) && link.url ? "border-red-300" : ""}
                  />
                  {!validateUrl(link.url) && link.url && (
                    <p className="text-xs text-red-500">Please enter a valid URL</p>
                  )}
                  {link.url && validateUrl(link.url) && (
                    <a
                      href={formatUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-maasta-orange hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Preview link
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {customLinks.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Add custom links to showcase your additional platforms</p>
                <p className="text-xs">Perfect for portfolio sites, Behance, or specialized platforms</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving || Object.values(formData).some((value) => 
                value && !validateUrl(value)
              ) || customLinks.some(link => 
                (link.title || link.url) && (!link.title || !link.url || !validateUrl(link.url))
              )}
              className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
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
      {(Object.values(formData).some(value => value) || customLinks.some(link => link.title && link.url)) && (
        <Card>
          <CardHeader>
            <CardTitle>Link Preview</CardTitle>
            <p className="text-sm text-gray-600">
              How your links will appear on your public profile:
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Default platform icons */}
              {defaultSocialLinks.map((link) => {
                const Icon = link.icon;
                const currentValue = formData[link.key];
                
                if (!currentValue || !validateUrl(currentValue)) return null;
                
                return (
                  <a
                    key={link.key}
                    href={formatUrl(currentValue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-orange hover:text-white transition-all duration-300"
                    title={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
              
              {/* Custom links */}
              {customLinks.map((link, index) => {
                if (!link.title || !link.url || !validateUrl(link.url)) return null;
                
                return (
                  <a
                    key={link.id || index}
                    href={formatUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-maasta-orange hover:text-white transition-all duration-300 text-sm"
                    title={link.title}
                  >
                    <Globe size={16} />
                    {link.title}
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
