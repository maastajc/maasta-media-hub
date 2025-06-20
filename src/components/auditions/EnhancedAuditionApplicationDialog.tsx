
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaUploadSection, MediaSubmission } from "./MediaUploadSection";
import { submitAuditionApplication } from "@/services/auditionApplicationService";
import { uploadMultipleFiles } from "@/utils/fileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface EnhancedAuditionApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  auditionId: string;
  auditionTitle: string;
  requestUploads?: boolean;
  onSuccess?: () => void;
}

export const EnhancedAuditionApplicationDialog = ({
  isOpen,
  onClose,
  auditionId,
  auditionTitle,
  requestUploads = false,
  onSuccess
}: EnhancedAuditionApplicationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [mediaData, setMediaData] = useState<MediaSubmission>({
    images: [],
    videos: [],
    portfolioUrls: [],
    notes: ""
  });
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to apply");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedMediaUrls: string[] = [];
      
      // Upload media files if any
      if (requestUploads && (mediaData.images.length > 0 || mediaData.videos.length > 0)) {
        const allFiles = [...mediaData.images, ...mediaData.videos];
        const uploadResults = await uploadMultipleFiles(allFiles, 'audition-media');
        uploadedMediaUrls = uploadResults.map(result => result.url);
      }

      // Combine all submission data
      const submissionData = {
        applicationNotes,
        mediaUrls: uploadedMediaUrls,
        portfolioUrls: mediaData.portfolioUrls,
        additionalNotes: mediaData.notes
      };

      const success = await submitAuditionApplication(
        auditionId, 
        JSON.stringify(submissionData)
      );

      if (success) {
        toast.success("Application submitted successfully!");
        onSuccess?.();
        onClose();
        
        // Reset form
        setApplicationNotes("");
        setMediaData({
          images: [],
          videos: [],
          portfolioUrls: [],
          notes: ""
        });
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for: {auditionTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Application Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-medium">
              Cover Letter / Application Notes
            </Label>
            <p className="text-sm text-gray-500 mb-3">
              Tell us why you're perfect for this role
            </p>
            <Textarea
              id="notes"
              placeholder="Explain your interest in this audition, relevant experience, and why you'd be a great fit..."
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Media Upload Section */}
          <MediaUploadSection
            onMediaChange={setMediaData}
            requestUploads={requestUploads}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-maasta-purple hover:bg-maasta-purple/90"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
