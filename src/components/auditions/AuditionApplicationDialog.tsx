
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

interface AuditionApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  auditionId: string;
  auditionTitle: string;
  onApplicationSubmitted: () => void;
}

const AuditionApplicationDialog: React.FC<AuditionApplicationDialogProps> = ({
  isOpen,
  onClose,
  auditionId,
  auditionTitle,
  onApplicationSubmitted,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const success = await submitAuditionApplication(auditionId, notes);
    
    if (success) {
      onApplicationSubmitted();
      onClose();
      setNotes("");
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
