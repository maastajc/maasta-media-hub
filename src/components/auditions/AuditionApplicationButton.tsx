
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedAuditionApplicationDialog } from "./EnhancedAuditionApplicationDialog";

interface AuditionApplicationButtonProps {
  auditionId: string;
  auditionTitle: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  requestUploads?: boolean;
  onSuccess?: () => void;
}

export const AuditionApplicationButton = ({
  auditionId,
  auditionTitle,
  variant = "default",
  size = "default",
  className,
  children = "Apply Now",
  requestUploads = false,
  onSuccess
}: AuditionApplicationButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
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
