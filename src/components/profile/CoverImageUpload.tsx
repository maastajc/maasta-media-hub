
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X, Upload, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CoverImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  userId: string;
}

const CoverImageUpload = ({ currentImageUrl, onImageUpdate, userId }: CoverImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Upload the cover image directly to supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/cover-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      // Update the profile with the new cover image URL
      const { error } = await supabase
        .from('profiles')
        .update({ cover_image_url: publicUrl })
        .eq('id', userId);

      if (error) throw error;

      onImageUpdate(publicUrl);
      toast.success("Cover image updated successfully!");
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      
      // Update the profile to remove the cover image URL
      const { error } = await supabase
        .from('profiles')
        .update({ cover_image_url: null })
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
      
      handleImageUpload(file);
    }
  };

  return (
    <div className="relative">
      {currentImageUrl ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Edit size={16} className="mr-1" />
            Change Cover
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white backdrop-blur-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Upload size={16} className="mr-1 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera size={16} className="mr-1" />
              Add Cover
            </>
          )}
        </Button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default CoverImageUpload;
