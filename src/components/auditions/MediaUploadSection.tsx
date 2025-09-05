
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface MediaUploadSectionProps {
  onMediaChange: (media: MediaSubmission) => void;
  requestUploads?: boolean;
}

export interface MediaSubmission {
  images: File[];
  videos: File[];
  portfolioUrls: string[];
  notes: string;
}

export const MediaUploadSection = ({ onMediaChange, requestUploads = true }: MediaUploadSectionProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");

  const updateMedia = (updatedData: Partial<MediaSubmission>) => {
    const mediaData = {
      images,
      videos,
      portfolioUrls,
      notes,
      ...updatedData
    };
    onMediaChange(mediaData);
  };

  const handleImageUpload = (file: File) => {
    if (images.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    const newImages = [...images, file];
    setImages(newImages);
    updateMedia({ images: newImages });
  };

  const handleVideoUpload = (file: File) => {
    if (videos.length >= 3) {
      toast.error("Maximum 3 videos allowed");
      return;
    }
    const newVideos = [...videos, file];
    setVideos(newVideos);
    updateMedia({ videos: newVideos });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateMedia({ images: newImages });
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    updateMedia({ videos: newVideos });
  };

  const addPortfolioUrl = () => {
    if (!urlInput.trim()) return;
    
    try {
      new URL(urlInput); // Validate URL
      const newUrls = [...portfolioUrls, urlInput.trim()];
      setPortfolioUrls(newUrls);
      setUrlInput("");
      updateMedia({ portfolioUrls: newUrls });
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = portfolioUrls.filter((_, i) => i !== index);
    setPortfolioUrls(newUrls);
    updateMedia({ portfolioUrls: newUrls });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    updateMedia({ notes: value });
  };

  // Always show the section now, but can be controlled by parent if needed

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Submission</CardTitle>
        <p className="text-sm text-gray-600">
          Upload your portfolio materials to showcase your talent
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Uploads */}
        <div>
          <Label className="text-base font-medium">Images ({images.length}/3)</Label>
          <p className="text-sm text-gray-500 mb-3">Upload headshots, portfolio images, or other relevant photos</p>
          
          {images.length < 3 && (
            <FileUpload
              onFileUpload={handleImageUpload}
              acceptedTypes="image/*"
              maxSizeMB={10}
              buttonText="Upload Image"
              className="mb-4"
            />
          )}
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Uploads */}
        <div>
          <Label className="text-base font-medium">Videos ({videos.length}/3)</Label>
          <p className="text-sm text-gray-500 mb-3">Upload acting reels, performance videos, or audition tapes</p>
          
          {videos.length < 3 && (
            <FileUpload
              onFileUpload={handleVideoUpload}
              acceptedTypes="video/*"
              maxSizeMB={50}
              buttonText="Upload Video"
              className="mb-4"
            />
          )}
          
          {videos.length > 0 && (
            <div className="space-y-3 mb-4">
              {videos.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeVideo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio URLs */}
        <div>
          <Label className="text-base font-medium">Portfolio Links</Label>
          <p className="text-sm text-gray-500 mb-3">Add links to your online portfolio, YouTube, Vimeo, or other platforms</p>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="https://your-portfolio-url.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPortfolioUrl()}
            />
            <Button onClick={addPortfolioUrl} variant="outline">
              <LinkIcon size={16} className="mr-2" />
              Add
            </Button>
          </div>
          
          {portfolioUrls.length > 0 && (
            <div className="space-y-2">
              {portfolioUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate flex-1"
                  >
                    {url}
                  </a>
                  <button
                    onClick={() => removeUrl(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <Label className="text-base font-medium">Additional Notes</Label>
          <p className="text-sm text-gray-500 mb-3">Any additional information you'd like to share</p>
          <Textarea
            placeholder="Tell us about your experience, special skills, or anything else relevant to this audition..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
