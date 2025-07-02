
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CoverImageCropper from "./CoverImageCropper";

interface CoverImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  userId: string;
}

const CoverImageUpload = ({ currentImageUrl, onImageUpdate, userId }: CoverImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);
      
      // Create filename with timestamp for cache busting
      const timestamp = Date.now();
      const fileName = `${userId}/cover-${timestamp}.jpg`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, croppedBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get the public URL with cache busting
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      const cachebustedUrl = `${publicUrl}?t=${timestamp}`;
      
      // Update the profile with the new cover image URL
      const { error } = await supabase
        .from('profiles')
        .update({ 
          cover_image_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      onImageUpdate(cachebustedUrl);
      toast.success("Cover image updated successfully!");
      setIsCropperOpen(false);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image. Please try again.");
    } finally {
      setIsUploading(false);
      // Clean up temp URL
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
        setTempImageUrl("");
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      
      // Update the profile to remove the cover image URL
      const { error } = await supabase
        .from('profiles')
        .update({ 
          cover_image_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      onImageUpdate(null);
      toast.success("Cover image removed successfully!");
    } catch (error) {
      console.error("Error removing cover image:", error);
      toast.error("Failed to remove cover image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Create temporary URL for cropping
      const tempUrl = URL.createObjectURL(file);
      setTempImageUrl(tempUrl);
      setIsCropperOpen(true);
    }
    
    // Reset input
    event.target.value = '';
  };

  const displayImageUrl = currentImageUrl ? 
    `${currentImageUrl}${currentImageUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : 
    currentImageUrl;

  return (
    <div className="space-y-4">
      {/* Cover Image Display */}
      <div className="relative w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg overflow-hidden">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            key={displayImageUrl} // Force re-render on URL change
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-maasta-orange/10 to-orange-50/30">
            <div className="text-center text-gray-500">
              <Camera size={32} className="mx-auto mb-2" />
              <p className="text-sm">No cover image uploaded</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Upload size={16} className="animate-spin" />
              Uploading...
            </>
          ) : currentImageUrl ? (
            <>
              <Edit size={16} />
              Change Cover
            </>
          ) : (
            <>
              <Camera size={16} />
              Upload Cover Photo
            </>
          )}
        </Button>
        
        {currentImageUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Remove
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Cover Image Cropper */}
      <CoverImageCropper
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
            setTempImageUrl("");
          }
        }}
        onCropComplete={handleImageUpload}
        imageUrl={tempImageUrl}
      />
    </div>
  );
};

export default CoverImageUpload;
