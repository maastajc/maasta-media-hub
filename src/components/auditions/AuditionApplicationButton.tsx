
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedAuditionApplicationDialog } from "./EnhancedAuditionApplicationDialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AuditionApplicationButtonProps {
  auditionId: string;
  auditionTitle: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  requestUploads?: boolean;
  onSuccess?: () => void;
  hasApplied?: boolean;
}

export const AuditionApplicationButton = ({
  auditionId,
  auditionTitle,
  variant = "default",
  size = "default",
  className,
  children = "Apply Now",
  requestUploads = false,
  onSuccess,
  hasApplied = false
}: AuditionApplicationButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      toast.error("Please sign in to apply for auditions");
      return;
    }

    if (hasApplied) {
      toast.info("You have already applied for this audition");
      return;
    }

    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Button>
      
      <EnhancedAuditionApplicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        auditionId={auditionId}
        auditionTitle={auditionTitle}
        requestUploads={requestUploads}
        onSuccess={onSuccess}
      />
    </>
  );
};
