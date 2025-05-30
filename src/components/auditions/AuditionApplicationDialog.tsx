
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitAuditionApplication } from "@/services/auditionApplicationService";
import { useToast } from "@/hooks/use-toast";

interface AuditionApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  auditionId: string;
  auditionTitle: string;
  onSuccess: () => void;
}

const AuditionApplicationDialog: React.FC<AuditionApplicationDialogProps> = ({
  isOpen,
  onClose,
  auditionId,
  auditionTitle,
  onSuccess,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const success = await submitAuditionApplication(auditionId, notes);
    
    if (success) {
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
      onSuccess();
      onClose();
      setNotes("");
    } else {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Audition</DialogTitle>
          <DialogDescription>
            Submit your application for "{auditionTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">
              Cover Letter / Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Tell us why you're perfect for this role..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-maasta-purple hover:bg-maasta-purple/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditionApplicationDialog;
