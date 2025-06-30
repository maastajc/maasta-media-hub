
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadProfileImage } from "@/utils/optimizedProfileImageUpload";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      
      // Create a file from the blob
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });
      
      const imageUrl = await uploadProfileImage(croppedFile, userId);
      
      // Update parent component immediately
      onImageUpdate(imageUrl);
      
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

  // Show only upload button if no image is set
  if (!currentImageUrl) {
    return (
      <>
        <div className="flex flex-col items-center">
          {/* Avatar with first letter */}
          <Avatar className="w-48 h-48 rounded-2xl shadow-xl border-4 border-white mb-4">
            <AvatarFallback className="text-6xl font-bold bg-maasta-purple text-white rounded-2xl">
              {getAvatarLetter()}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload button */}
          <Button
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-6 py-2 rounded-full"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </>
            )}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Image Cropper */}
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
  }

  return (
    <>
      <div className="relative group">
        <Avatar className="w-48 h-48 rounded-2xl shadow-xl border-4 border-white">
          <AvatarImage 
            src={currentImageUrl} 
            alt={fullName}
            className="object-cover"
          />
          <AvatarFallback className="text-6xl font-bold bg-maasta-purple text-white rounded-2xl">
            {getAvatarLetter()}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
          {isUploading ? (
            <div className="text-white text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="text-white text-center" onClick={triggerFileSelect}>
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Change Photo</span>
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

        {/* Upload button for mobile */}
        <Button
          onClick={triggerFileSelect}
          disabled={isUploading}
          size="sm"
          className="lg:hidden mt-4 w-full"
          variant="outline"
        >
          <Camera className="w-4 h-4 mr-2" />
          Change Photo
        </Button>
      </div>

      {/* Image Cropper */}
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
