
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Edit, Plus } from "lucide-react";
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
        .from('profile-pictures')
        .upload(fileName, croppedBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get the public URL with cache busting
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);
      
      const cachebustedUrl = `${publicUrl}?t=${timestamp}`;
      
      // Update the profile with the new cover image URL using cachebusted URL
      const { error } = await supabase
        .from('profiles')
        .update({ 
          cover_image_url: cachebustedUrl,
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
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (.jpg, .jpeg, .png, .webp)");
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

  // Force cache busting for current image display
  const displayImageUrl = currentImageUrl && !currentImageUrl.includes('?t=') ? 
    `${currentImageUrl}?t=${Date.now()}` : 
    currentImageUrl;

  return (
    <div className="relative w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg overflow-hidden group">
      {/* Cover Image Display */}
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

      {/* Overlay gradient for better button visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />

      {/* Upload/Edit Button Overlay */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border-0 h-10 w-10 p-0 rounded-full"
        >
          {isUploading ? (
            <Upload size={16} className="animate-spin text-maasta-orange" />
          ) : (
            <Plus size={16} className="text-maasta-orange" />
          )}
        </Button>
      </div>

      {/* Remove Button (only show if image exists) */}
      {currentImageUrl && (
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border-0 h-10 w-10 p-0 rounded-full"
          >
            <X size={16} className="text-red-500" />
          </Button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
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
