
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Camera, Upload, X, Check } from "lucide-react";
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
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
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

    setSelectedFile(file);
    
    // Create preview for crop dialog
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropPreviewUrl(e.target?.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setShowCropDialog(false);
      
      const imageUrl = await uploadProfileImage(selectedFile, userId);
      
      // Update parent component immediately
      onImageUpdate(imageUrl);
      
      toast({
        title: "✅ Profile picture updated successfully!",
        description: "Your new profile picture is now live on your profile.",
      });
      
      // Reset states
      setSelectedFile(null);
      setCropPreviewUrl(null);
      
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

  const cancelPreview = () => {
    setShowCropDialog(false);
    setSelectedFile(null);
    setCropPreviewUrl(null);
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

        {/* Crop & Preview Dialog */}
        <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crop & Preview Profile Picture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {cropPreviewUrl && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img 
                      src={cropPreviewUrl} 
                      alt="Crop preview"
                      className="max-w-full max-h-64 object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Preview how this will appear on your profile:</p>
                    <Avatar className="w-24 h-24 mx-auto rounded-2xl shadow-lg border-2 border-white">
                      <AvatarImage 
                        src={cropPreviewUrl} 
                        alt="Profile preview"
                        className="object-cover"
                      />
                    </Avatar>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={cancelPreview}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleCropConfirm} 
                className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Use This Photo
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Crop & Preview Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop & Preview Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cropPreviewUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img 
                    src={cropPreviewUrl} 
                    alt="Crop preview"
                    className="max-w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview how this will appear on your profile:</p>
                  <Avatar className="w-24 h-24 mx-auto rounded-2xl shadow-lg border-2 border-white">
                    <AvatarImage 
                      src={cropPreviewUrl} 
                      alt="Profile preview"
                      className="object-cover"
                    />
                  </Avatar>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={cancelPreview}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleCropConfirm} 
              className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Use This Photo
                </>
              )}
            </Button>
          </DialogFooter>
        </Dialog>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpload;
