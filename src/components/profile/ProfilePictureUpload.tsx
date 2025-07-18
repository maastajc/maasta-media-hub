
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadProfileImage } from "@/utils/optimizedProfileImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import ImageCropper from "./ImageCropper";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userId: string;
  onImageUpdate: (imageUrl: string) => void;
  fullName?: string;
}

const ProfilePictureUpload = ({ 
  currentImageUrl, 
  userId, 
  onImageUpdate, 
  fullName 
}: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview URL for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImageUrl(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true);
      setShowCropper(false);
      
      // Create preview URL immediately for instant UI update
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setPreviewImageUrl(previewUrl);
      
      // Create a file from the blob
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });
      
      const imageUrl = await uploadProfileImage(croppedFile, userId);
      
      // Update with final URL and trigger parent update
      setPreviewImageUrl(imageUrl);
      onImageUpdate(imageUrl);
      
      // Invalidate all relevant caches to ensure immediate updates everywhere
      await queryClient.invalidateQueries({ queryKey: ['artistProfile', userId] });
      await queryClient.invalidateQueries({ queryKey: ['artist-profile', userId] });
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['featured-artists'] });
      
      // Clean up the temporary preview URL
      URL.revokeObjectURL(previewUrl);
      
      toast({
        title: "✅ Profile picture updated successfully!",
        description: "Your new profile picture is now live on your profile.",
      });
      
      // Reset states
      setSelectedImageUrl(null);
      
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      toast({
        title: "❌ Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
      // Revert to original image on error
      setPreviewImageUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get the first letter of the name for avatar fallback
  const getAvatarLetter = () => {
    if (fullName && fullName !== 'New User') {
      return fullName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage 
            src={previewImageUrl} 
            alt={fullName}
            className="object-cover"
            key={`avatar-${previewImageUrl || 'default'}-${Date.now()}`} // Force re-render with better key
          />
          <AvatarFallback className="bg-maasta-orange text-white text-2xl font-bold">
            {getAvatarLetter()}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
          {isUploading ? (
            <div className="text-white text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="text-white text-center" onClick={triggerFileSelect}>
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">{previewImageUrl ? 'Change Photo' : 'Add Photo'}</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload button for mobile/fallback */}
      <div className="mt-4 w-full flex justify-center">
        <Button
          onClick={triggerFileSelect}
          disabled={isUploading}
          size="sm"
          className="lg:hidden"
          variant="outline"
        >
          <Camera className="w-4 h-4 mr-2" />
          {previewImageUrl ? 'Change Photo' : 'Add Photo'}
        </Button>
      </div>

      {/* Enhanced Image Cropper */}
      {selectedImageUrl && (
        <ImageCropper
          isOpen={showCropper}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          imageUrl={selectedImageUrl}
        />
      )}
    </>
  );
};

export default ProfilePictureUpload;
