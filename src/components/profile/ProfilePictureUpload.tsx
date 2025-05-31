
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadProfileImage } from "@/utils/optimizedProfileImageUpload";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const imageUrl = await uploadProfileImage(file, userId);
      
      // Update parent component immediately
      onImageUpdate(imageUrl);
      setPreviewImage(null);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated"
      });
      
      // Force a small delay to ensure the image loads with new URL
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive"
      });
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const cancelPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-48 h-48 rounded-2xl shadow-xl border-4 border-white">
        <AvatarImage 
          src={previewImage || currentImageUrl} 
          alt={fullName}
          className="object-cover"
        />
        <AvatarFallback className="text-4xl font-bold bg-maasta-purple text-white">
          {fullName?.charAt(0) || 'U'}
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

      {/* Preview actions */}
      {previewImage && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={cancelPreview}
            className="bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

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
  );
};

export default ProfilePictureUpload;
