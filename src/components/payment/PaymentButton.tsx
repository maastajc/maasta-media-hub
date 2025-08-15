import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentButtonProps {
  eventId?: string;
  auditionId?: string;
  amount: number;
  currency?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: () => void;
}

export const PaymentButton = ({
  eventId,
  auditionId,
  amount,
  currency = "INR",
  children,
  variant = "default",
  size = "default",
  className,
  onSuccess
}: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to make payment");
      return;
    }

    if ((!eventId && !auditionId) || (eventId && auditionId)) {
      toast.error("Invalid payment configuration");
      return;
    }

    setIsLoading(true);

    try {
      const returnUrl = `${window.location.origin}/payment-success?type=${eventId ? 'event' : 'audition'}&id=${eventId || auditionId}`;

      const { data, error } = await supabase.functions.invoke('create-phonepe-payment', {
        body: {
          eventId,
          auditionId,
          amount,
          returnUrl
        }
      });

      if (error) {
        console.error('Payment creation error:', error);
        throw new Error(error.message || 'Failed to create payment');
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment creation failed');
      }

      // Store order ID in localStorage for later verification
      localStorage.setItem('pending_payment_order_id', data.orderId);
      localStorage.setItem('pending_payment_type', eventId ? 'event' : 'audition');
      localStorage.setItem('pending_payment_id', eventId || auditionId || '');

      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl;

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {children || `Pay ₹${amount.toFixed(2)}`}
    </Button>
  );
};