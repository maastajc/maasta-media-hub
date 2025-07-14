
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
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

  const validateImageFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error(`${file.name} is not a supported image format. Please use JPG, PNG, or WebP.`);
      return false;
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const validFiles = Array.from(files).filter(validateImageFile);
      
      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      // Check if adding these files would exceed the limit of 4
      if (images.length + validFiles.length > 4) {
        toast.error(`You can only upload ${4 - images.length} more image(s).`);
        setIsUploading(false);
        return;
      }

      let successCount = 0;
      
      for (const file of validFiles) {
        try {
          // Create a simple filename without special characters
          const timestamp = Date.now();
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${userId}/${timestamp}-${cleanName}`;
          
          console.log('Uploading file:', fileName);
          
          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('artist_media')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
            continue;
          }

          console.log('Upload successful:', uploadData);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('artist_media')
            .getPublicUrl(uploadData.path);

          console.log('Public URL:', publicUrl);

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
              is_video: false,
              is_embed: false,
              description: null
            });

          if (dbError) {
            console.error('Database error:', dbError);
            toast.error(`Failed to save ${file.name} information: ${dbError.message}`);
            
            // Clean up uploaded file if database save fails
            await supabase.storage
              .from('artist_media')
              .remove([uploadData.path]);
            continue;
          }

          console.log('Database save successful');
          successCount++;
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} image${successCount !== 1 ? 's' : ''}!`);
        // Refresh the profile data
        onUpdate();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media files');
    } finally {
      setIsUploading(false);
      // Clear the input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleDeleteMedia = async (mediaId: string, fileName: string, url: string) => {
    try {
      // Delete from database first
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', mediaId)
        .eq('user_id', userId);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error('Failed to delete media from database');
        return;
      }

      // Extract file path from URL for storage deletion
      try {
        const urlParts = url.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'artist_media');
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          const { error: storageError } = await supabase.storage
            .from('artist_media')
            .remove([filePath]);
          
          if (storageError) {
            console.warn('Storage delete warning:', storageError);
            // Don't show error to user as database deletion succeeded
          }
        }
      } catch (storageError) {
        console.warn('Storage cleanup failed:', storageError);
        // Don't show error to user as database deletion succeeded
      }

      toast.success(`${fileName} deleted successfully`);
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete media');
    }
  };

  const canUploadImage = images.length < 4;
  const getImageUrl = (image: MediaAsset) => image.asset_url || image.url;

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#ff8200]" />
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
          className="flex items-center justify-center gap-2 border-[#ff8200] text-[#ff8200] hover:bg-[#ff8200] hover:text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="truncate">Add Image</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* Upload Input */}
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload Guidelines */}
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-[#ff8200] mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Images: Max 10MB each, up to 4 files</li>
            <li>• Supported formats: JPG, PNG, WebP</li>
            <li>• Recommended: High-quality portfolio pieces showcasing your work</li>
          </ul>
        </div>

        {/* Images Section */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#ff8200]" />
              <h3 className="text-lg font-semibold">Images ({images.length}/4)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(image)}
                      alt={image.description || image.file_name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
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
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 h-8 w-8 p-0 rounded-lg"
                      onClick={() => handleDeleteMedia(image.id, image.file_name, getImageUrl(image))}
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
              className="bg-[#ff8200] hover:bg-[#ff8200]/90 text-white rounded-lg"
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
              <Upload className="w-4 h-4 text-[#ff8200] animate-spin" />
              <span className="text-[#ff8200]">Uploading images...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaUploadSection;
