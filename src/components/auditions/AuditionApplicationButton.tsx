
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedAuditionApplicationDialog } from "./EnhancedAuditionApplicationDialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentButton } from "@/components/payment/PaymentButton";

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
  paymentRequired?: boolean;
  paymentAmount?: number;
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
  hasApplied = false,
  paymentRequired = false,
  paymentAmount
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

  if (paymentRequired && paymentAmount) {
    return (
      <PaymentButton
        auditionId={auditionId}
        amount={paymentAmount}
        variant={variant}
        size={size}
        className={className}
        onSuccess={() => {
          toast.success("Payment successful! Your audition application has been submitted.");
          onSuccess?.();
        }}
      >
        Pay ₹{paymentAmount} & Apply
      </PaymentButton>
    );
  }

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
        onSuccess={onSuccess}
      />
    </>
  );
};
