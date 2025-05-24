
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Camera, Video, Upload, Eye } from "lucide-react";

const mediaSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  file_name: z.string().min(1, "File name is required"),
  file_type: z.string().min(1, "File type is required"),
  description: z.string().optional(),
  is_video: z.boolean(),
  is_embed: z.boolean(),
  embed_source: z.string().optional(),
  file_size: z.number().min(1),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

interface MediaSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const MediaSection = ({ profileData, onUpdate, userId }: MediaSectionProps) => {
  const { toast } = useToast();
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      url: "",
      file_name: "",
      file_type: "",
      description: "",
      is_video: false,
      is_embed: false,
      embed_source: "",
      file_size: 0,
    },
  });

  const mediaAssets = profileData?.media_assets || [];
  const photos = mediaAssets.filter((asset: any) => !asset.is_video);
  const videos = mediaAssets.filter((asset: any) => asset.is_video);

  const resetForm = () => {
    form.reset({
      url: "",
      file_name: "",
      file_type: "",
      description: "",
      is_video: false,
      is_embed: false,
      embed_source: "",
      file_size: 0,
    });
  };

  const onSubmit = async (values: MediaFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      if (editingMedia) {
        const { error } = await supabase
          .from("media_assets")
          .update({ ...values, user_id: userId })
          .eq("id", editingMedia.id);

        if (error) throw error;
        toast({ title: "Media updated successfully" });
      } else {
        const { error } = await supabase
          .from("media_assets")
          .insert({ ...values, user_id: userId });

        if (error) throw error;
        toast({ title: "Media added successfully" });
      }

      onUpdate();
      setIsAddingMedia(false);
      setEditingMedia(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving media:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save media",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (media: any) => {
    setEditingMedia(media);
    form.reset({
      url: media.url,
      file_name: media.file_name,
      file_type: media.file_type,
      description: media.description || "",
      is_video: media.is_video,
      is_embed: media.is_embed,
      embed_source: media.embed_source || "",
      file_size: media.file_size,
    });
    setIsAddingMedia(true);
  };

  const handleDelete = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;
      
      toast({ title: "Media deleted successfully" });
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast({
        title: "Error",
        description: "Failed to delete media",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setIsAddingMedia(false);
    setEditingMedia(null);
    resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Portfolio ({mediaAssets.length})</h2>
        <Button
          onClick={() => setIsAddingMedia(true)}
          className="bg-maasta-purple hover:bg-maasta-purple/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 mx-auto text-maasta-orange mb-2" />
            <p className="text-2xl font-bold">{photos.length}</p>
            <p className="text-sm text-gray-600">Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 mx-auto text-maasta-purple mb-2" />
            <p className="text-2xl font-bold">{videos.length}</p>
            <p className="text-sm text-gray-600">Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{photos.length + videos.length}</p>
            <p className="text-sm text-gray-600">Total Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{Math.max(3 - photos.length, 0) + Math.max(3 - videos.length, 0)}</p>
            <p className="text-sm text-gray-600">Slots Available</p>
          </CardContent>
        </Card>
      </div>

      {mediaAssets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No media assets yet</h3>
            <p className="text-gray-600 mb-4">Start building your portfolio by adding photos and videos</p>
            <Button
              onClick={() => setIsAddingMedia(true)}
              className="bg-maasta-purple hover:bg-maasta-purple/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaAssets.map((media: any) => (
            <Card key={media.id} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative bg-gray-100">
                {media.is_video ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    controls
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.description || media.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder.svg';
                    }}
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleEdit(media)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleDelete(media.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-9 w-9 text-white hover:bg-white/20 rounded-md transition-colors"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                </div>

                {/* Media Type Badge */}
                <div className="absolute top-2 left-2">
                  {media.is_video ? (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Video size={12} className="mr-1" />
                      Video
                    </div>
                  ) : (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Camera size={12} className="mr-1" />
                      Photo
                    </div>
                  )}
                </div>
              </div>
              
              {media.description && (
                <CardContent className="p-3">
                  <p className="text-sm text-gray-700 truncate">{media.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddingMedia} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMedia ? "Edit Media" : "Add Media Asset"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media URL*</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="file_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Type*</FormLabel>
                      <FormControl>
                        <Input placeholder="image/jpeg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="file_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Size (bytes)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1024000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this media asset..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_video"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div>
                        <FormLabel>Video Asset</FormLabel>
                        <p className="text-sm text-gray-600">
                          Toggle if this is a video file
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_embed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div>
                        <FormLabel>Embedded Media</FormLabel>
                        <p className="text-sm text-gray-600">
                          Toggle if this is embedded content
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("is_embed") && (
                <FormField
                  control={form.control}
                  name="embed_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embed Source</FormLabel>
                      <FormControl>
                        <Input placeholder="YouTube, Vimeo, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-maasta-purple hover:bg-maasta-purple/90"
                >
                  {isSaving ? "Saving..." : editingMedia ? "Update Media" : "Add Media"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaSection;
