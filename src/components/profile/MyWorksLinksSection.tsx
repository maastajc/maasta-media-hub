import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ExternalLink, 
  Edit, 
  Plus, 
  Trash2, 
  Globe, 
  Youtube, 
  Music,
  FileImage,
  Play,
  Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkLink {
  id: string;
  work_title: string;
  work_url: string;
  display_order: number;
}

interface MyWorksLinksSectionProps {
  userId: string;
  isOwnProfile?: boolean;
  onEditSection?: (section: string) => void;
}

interface EmbedPreview {
  type: 'youtube' | 'vimeo' | 'soundcloud' | 'behance' | 'drive' | 'image' | 'other';
  embedUrl?: string;
  title?: string;
  thumbnail?: string;
}

const MyWorksLinksSection = ({ userId, isOwnProfile = false, onEditSection }: MyWorksLinksSectionProps) => {
  const { toast } = useToast();
  const [workLinks, setWorkLinks] = useState<WorkLink[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newWorkLink, setNewWorkLink] = useState({ work_title: '', work_url: '' });

  useEffect(() => {
    console.log('[MyWorksLinksSection] Rendered with userId:', userId, 'isOwnProfile:', isOwnProfile);
    fetchWorkLinks();
  }, [userId]);

  const fetchWorkLinks = async () => {
    try {
      console.log('[MyWorksLinksSection] Fetching work links for userId:', userId);
      const { data, error } = await supabase
        .from('work_links')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log('[MyWorksLinksSection] Fetched work links:', data);
      setWorkLinks(data || []);
    } catch (error) {
      console.error('Error fetching work links:', error);
    }
  };

  const addWorkLink = async () => {
    if (!newWorkLink.work_title.trim() || !newWorkLink.work_url.trim()) {
      toast({
        title: "Error",
        description: "Please provide both title and URL",
        variant: "destructive"
      });
      return;
    }

    if (!isValidUrl(newWorkLink.work_url)) {
      toast({
        title: "Error", 
        description: "Please provide a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('work_links')
        .insert({
          user_id: userId,
          work_title: newWorkLink.work_title.trim(),
          work_url: normalizeUrl(newWorkLink.work_url.trim()),
          display_order: workLinks.length
        })
        .select()
        .single();

      if (error) throw error;

      setWorkLinks([...workLinks, data]);
      setNewWorkLink({ work_title: '', work_url: '' });
      toast({
        title: "Success",
        description: "Work link added successfully"
      });
    } catch (error) {
      console.error('Error adding work link:', error);
      toast({
        title: "Error",
        description: "Failed to add work link",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeWorkLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkLinks(workLinks.filter(link => link.id !== id));
      toast({
        title: "Success",
        description: "Work link removed successfully"
      });
    } catch (error) {
      console.error('Error removing work link:', error);
      toast({
        title: "Error",
        description: "Failed to remove work link",
        variant: "destructive"
      });
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(normalizeUrl(url));
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (url: string): string => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const getEmbedPreview = (url: string): EmbedPreview => {
    const normalizedUrl = normalizeUrl(url);
    
    // YouTube
    if (normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(normalizedUrl);
      return {
        type: 'youtube',
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : undefined,
        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined
      };
    }
    
    // Vimeo
    if (normalizedUrl.includes('vimeo.com')) {
      const videoId = extractVimeoId(normalizedUrl);
      return {
        type: 'vimeo',
        embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : undefined
      };
    }
    
    // SoundCloud
    if (normalizedUrl.includes('soundcloud.com')) {
      return {
        type: 'soundcloud',
        embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(normalizedUrl)}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`
      };
    }
    
    // Behance
    if (normalizedUrl.includes('behance.net')) {
      return { type: 'behance' };
    }
    
    // Google Drive
    if (normalizedUrl.includes('drive.google.com')) {
      return { type: 'drive' };
    }
    
    // Image files
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(normalizedUrl)) {
      return { type: 'image' };
    }
    
    return { type: 'other' };
  };

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const getIconForUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return Youtube;
    if (url.includes('soundcloud.com')) return Music;
    if (url.includes('behance.net')) return FileImage;
    if (url.includes('vimeo.com')) return Play;
    if (url.includes('drive.google.com')) return FileImage;
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return Camera;
    return Globe;
  };

  const renderPreview = (workLink: WorkLink) => {
    const preview = getEmbedPreview(workLink.work_url);
    const Icon = getIconForUrl(workLink.work_url);

    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-maasta-purple mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 truncate">{workLink.work_title}</h4>
              
              {/* Embed Preview */}
              {preview.type === 'youtube' && preview.embedUrl && (
                <div className="aspect-video mb-3 bg-gray-100 rounded overflow-hidden">
                  <iframe
                    src={preview.embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={workLink.work_title}
                  />
                </div>
              )}
              
              {preview.type === 'vimeo' && preview.embedUrl && (
                <div className="aspect-video mb-3 bg-gray-100 rounded overflow-hidden">
                  <iframe
                    src={preview.embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={workLink.work_title}
                  />
                </div>
              )}
              
              {preview.type === 'soundcloud' && preview.embedUrl && (
                <div className="mb-3">
                  <iframe
                    src={preview.embedUrl}
                    className="w-full h-32"
                    title={workLink.work_title}
                  />
                </div>
              )}
              
              {preview.type === 'image' && (
                <div className="mb-3">
                  <img
                    src={workLink.work_url}
                    alt={workLink.work_title}
                    className="w-full max-h-64 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Link */}
              <a
                href={normalizeUrl(workLink.work_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
              >
                View Work <ExternalLink size={12} />
              </a>
            </div>
            
            {isOwnProfile && isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWorkLink(workLink.id)}
                className="text-red-600 hover:text-red-700 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-maasta-purple" />
          My Works Links
          {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
        </CardTitle>
        {isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {workLinks.length === 0 && !isEditing ? (
          <div className="italic text-gray-400">No work links added.</div>
        ) : (
          <div className="space-y-4">
            {workLinks.map((workLink) => (
              <div key={workLink.id}>
                {renderPreview(workLink)}
              </div>
            ))}
          </div>
        )}

        {isOwnProfile && isEditing && (
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-4">
              <div>
                <Label htmlFor="work_title">Work Title</Label>
                <Input
                  id="work_title"
                  placeholder="e.g., Short Film: The Escape, Portfolio Reel, etc."
                  value={newWorkLink.work_title}
                  onChange={(e) => setNewWorkLink({ ...newWorkLink, work_title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="work_url">Work URL</Label>
                <Input
                  id="work_url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={newWorkLink.work_url}
                  onChange={(e) => setNewWorkLink({ ...newWorkLink, work_url: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={addWorkLink}
                disabled={isLoading || workLinks.length >= 5}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Work Link
              </Button>
              
              {workLinks.length >= 5 && (
                <Alert>
                  <AlertDescription>
                    You can add up to 5 work links maximum.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyWorksLinksSection;