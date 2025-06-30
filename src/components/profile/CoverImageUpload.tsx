
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadProfileImage } from "@/utils/profileImageUpload";

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
      
      // Upload the cover image
      const imageUrl = await uploadProfileImage(file, userId, 'cover');
      
      // Update the profile with the new cover image URL
      const { error } = await supabase
        .from('profiles')
        .update({ cover_image_url: imageUrl })
        .eq('id', userId);

      if (error) throw error;

      onImageUpdate(imageUrl);
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
    <Card className="w-full">
      <CardContent className="p-0 relative">
        <div 
          className="w-full h-48 bg-gradient-to-r from-maasta-orange/20 to-orange-100/50 rounded-t-lg relative overflow-hidden cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {currentImageUrl ? (
            <>
              <img 
                src={currentImageUrl} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <Camera size={20} />
                  <span>Change Cover</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={isUploading}
              >
                <X size={16} />
              </Button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <div className="text-center text-gray-600">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Add Cover Image</p>
                <p className="text-xs">Click to upload</p>
              </div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  );
};

export default CoverImageUpload;
