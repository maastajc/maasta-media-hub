
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Loader2, UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  previewUrl?: string;
  isLoading?: boolean;
  onRemove?: () => void;
  className?: string;
  buttonText?: string;
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/webm'
];

export function FileUpload({
  onFileUpload,
  acceptedTypes = "image/*",
  maxSizeMB = 5,
  previewUrl,
  isLoading = false,
  onRemove,
  className = "",
  buttonText = "Upload image"
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  const validateFileType = (file: File): boolean => {
    // Determine allowed types based on acceptedTypes prop
    let allowedTypes: string[] = [];
    
    if (acceptedTypes.includes('image')) {
      allowedTypes = [...allowedTypes, ...ALLOWED_IMAGE_TYPES];
    }
    
    if (acceptedTypes.includes('video')) {
      allowedTypes = [...allowedTypes, ...ALLOWED_VIDEO_TYPES];
    }
    
    // If no specific types defined, fall back to basic validation
    if (allowedTypes.length === 0) {
      return file.type.startsWith('image/') || file.type.startsWith('video/');
    }
    
    return allowedTypes.includes(file.type.toLowerCase());
  };
  
  const validateFileSize = (file: File): boolean => {
    return file.size <= maxSizeBytes;
  };
  
  const validateFileName = (fileName: string): boolean => {
    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return !dangerousExtensions.includes(fileExtension);
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };
  
  const validateAndHandleFile = (file: File) => {
    // Validate file name
    if (!validateFileName(file.name)) {
      toast({
        title: "Invalid file type",
        description: "This file type is not allowed for security reasons",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (!validateFileType(file)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid ${acceptedTypes} file`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size
    if (!validateFileSize(file)) {
      toast({
        title: "File too large",
        description: `The file size should not exceed ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }
    
    // Additional security check: ensure file has content
    if (file.size === 0) {
      toast({
        title: "Invalid file",
        description: "The selected file appears to be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Pass the validated file to parent
    onFileUpload(file);
    
    // Clear the input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-border">
          <img 
            src={previewUrl} 
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {onRemove && (
            <Button 
              type="button"
              variant="destructive" 
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onRemove}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {isLoading ? (
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
          ) : (
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max file size: {maxSizeMB}MB
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : buttonText}
          </Button>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>
  );
}
