
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Video, Trash2, Eye, Plus } from "lucide-react";

interface MediaUploadSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const MediaUploadSection = ({ profileData, onUpdate, userId }: MediaUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const mediaAssets = profileData?.media_assets || [];
  const photos = mediaAssets.filter((asset: any) => !asset.is_video);
  const videos = mediaAssets.filter((asset: any) => asset.is_video);

  const uploadFile = async (file: File, isVideo: boolean = false) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Check limits before upload
    const currentCount = isVideo ? videos.length : photos.length;
    if (currentCount >= 4) {
      toast({
        title: "Upload limit reached",
        description: `You can only upload up to 4 ${isVideo ? 'videos' : 'photos'}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage using correct bucket names
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const bucketName = isVideo ? 'videos' : 'photos';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Save to database with both user_id and artist_id
      const mediaData = {
        url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        is_video: isVideo,
        is_embed: false,
        user_id: userId,
        artist_id: userId, // Use userId as artist_id since they match
      };

      const { error: dbError } = await supabase
        .from("media_assets")
        .insert(mediaData);

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: `${isVideo ? 'Video' : 'Photo'} uploaded successfully`,
      });

      onUpdate();
    } catch (error: any) {
      console.error("Upload error:", error.message);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: string, fileName: string, isVideo: boolean) => {
    try {
      // Delete from storage using correct bucket name
      const bucketName = isVideo ? 'videos' : 'photos';
      await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;

      toast({
        title: "Media deleted",
        description: "Media file deleted successfully",
      });

      onUpdate();
    } catch (error: any) {
      console.error("Delete error:", error.message);
      toast({
        title: "Delete failed",
        description: "Failed to delete media file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (isVideo: boolean) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = isVideo ? 'video/*' : 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadFile(file, isVideo);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Portfolio ({mediaAssets.length})</h2>
      </div>

      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Camera className="mr-2 text-maasta-orange" size={20} />
                Photos ({photos.length}/4)
              </div>
              {photos.length < 4 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => handleFileSelect(false)}
                  disabled={isUploading}
                >
                  <Plus size={16} className="text-gray-500" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {photos.length >= 4 && (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Photo limit reached (4/4)</p>
                <p className="text-xs">Delete a photo to upload a new one</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Video className="mr-2 text-maasta-purple" size={20} />
                Videos ({videos.length}/4)
              </div>
              {videos.length < 4 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => handleFileSelect(true)}
                  disabled={isUploading}
                >
                  <Plus size={16} className="text-gray-500" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {videos.length >= 4 && (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video limit reached (4/4)</p>
                <p className="text-xs">Delete a video to upload a new one</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Media Gallery */}
      {mediaAssets.length > 0 && (
        <div className="space-y-6">
          {/* Photos Grid */}
          {photos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="mr-2" size={20} />
                Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo: any) => (
                  <Card key={photo.id} className="group relative overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={photo.url}
                        alt={photo.description || photo.file_name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          console.error('Image failed to load:', photo.url);
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
                          >
                            <Eye size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(photo.id, photo.file_name, false)}
                            className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{photo.file_name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Videos Horizontal Scroll */}
          {videos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Video className="mr-2" size={20} />
                Videos ({videos.length})
              </h3>
              <div className="flex overflow-x-auto gap-4 pb-4">
                {videos.map((video: any) => (
                  <Card key={video.id} className="group relative overflow-hidden flex-shrink-0 w-80">
                    <div className="aspect-video relative">
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        onError={(e) => {
                          console.error('Video failed to load:', video.url);
                        }}
                      />
                      <button
                        onClick={() => handleDelete(video.id, video.file_name, true)}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{video.file_name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mediaAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex justify-center gap-4 mb-4">
              <Camera className="w-16 h-16 text-gray-400" />
              <Video className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No media assets yet</h3>
            <p className="text-gray-600 mb-4">Start building your portfolio by uploading photos and videos</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleFileSelect(false)}
                className="bg-maasta-orange hover:bg-maasta-orange/90"
                disabled={isUploading}
              >
                <Camera className="mr-2" size={16} />
                Upload Photos
              </Button>
              <Button
                onClick={() => handleFileSelect(true)}
                className="bg-maasta-purple hover:bg-maasta-purple/90"
                disabled={isUploading}
              >
                <Video className="mr-2" size={16} />
                Upload Videos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUploadSection;
