
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Artist, MediaAsset } from "@/types/artist";

interface MediaUploadSectionProps {
  profileData: Artist;
  onUpdate: () => void;
  userId: string;
}

const MediaUploadSection = ({ profileData, onUpdate, userId }: MediaUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const mediaAssets = profileData.media_assets || [];
  const images = mediaAssets.filter(asset => !asset.is_video);

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type for images
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }

        // Check limits
        if (images.length >= 4) {
          toast.error("Maximum 4 images allowed");
          continue;
        }

        // Validate file size (10MB for images)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max size: 10MB`);
          continue;
        }

        // Upload to storage
        const fileName = `${userId}/${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from('artist_media')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('artist_media')
          .getPublicUrl(data.path);

        // Save to database
        const { error: dbError } = await supabase
          .from('media_assets')
          .insert({
            user_id: userId,
            artist_id: userId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            url: publicUrl,
            asset_url: publicUrl,
            asset_type: file.type,
            is_video: false,
            is_embed: false
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast.error(`Failed to save ${file.name} information`);
          continue;
        }

        toast.success(`${file.name} uploaded successfully`);
      }

      onUpdate();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string, fileName: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', mediaId)
        .eq('user_id', userId);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error('Failed to delete media');
        return;
      }

      toast.success(`${fileName} deleted successfully`);
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete media');
    }
  };

  const canUploadImage = images.length < 4;

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-maasta-orange" />
          Media Portfolio
          <Badge variant="outline" className="ml-2">
            {images.length}/4 Images
          </Badge>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploading || !canUploadImage}
          className="flex items-center justify-center gap-2 border-maasta-orange text-maasta-orange hover:bg-maasta-orange hover:text-white"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="truncate">Add Image</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* Upload Input */}
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload Guidelines */}
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-maasta-orange mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Images: Max 10MB each, up to 4 files (JPG, PNG, WebP)</li>
            <li>• Recommended: High-quality portfolio pieces showcasing your work</li>
          </ul>
        </div>

        {/* Images Section */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-maasta-orange" />
              <h3 className="text-lg font-semibold">Images ({images.length}/4)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.asset_url}
                      alt={image.description || image.file_name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        Image
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                      onClick={() => handleDeleteMedia(image.id, image.file_name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {image.description && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{image.description}</p>
                  )}
                  <p className="text-xs text-gray-500 truncate">{image.file_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images uploaded</h3>
            <p className="text-gray-600 mb-4">
              Showcase your work by uploading images to your portfolio
            </p>
            <Button
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>
        )}

        {/* Upload Status */}
        {isUploading && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-maasta-orange animate-spin" />
              <span className="text-maasta-orange">Uploading images...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaUploadSection;
