import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const type = searchParams.get('type');
  const id = searchParams.get('id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = localStorage.getItem('pending_payment_order_id');
        if (!orderId) {
          throw new Error('No payment order found');
        }

        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { orderId }
        });

        if (error) {
          console.error('Payment verification error:', error);
          throw new Error(error.message || 'Payment verification failed');
        }

        if (!data.success) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setPaymentDetails(data.payment);
        setPaymentStatus(data.payment.status === 'success' ? 'success' : 'failed');

        if (data.payment.status === 'success') {
          toast.success('Payment completed successfully!');
          // Clear localStorage
          localStorage.removeItem('pending_payment_order_id');
          localStorage.removeItem('pending_payment_type');
          localStorage.removeItem('pending_payment_id');
        } else {
          toast.error('Payment was not successful');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        toast.error(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    verifyPayment();
  }, []);

  const handleContinue = () => {
    if (paymentStatus === 'success') {
      if (type === 'event') {
        navigate(`/event-details/${id}`);
      } else if (type === 'audition') {
        navigate(`/audition-details/${id}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleRetry = () => {
    if (type === 'event') {
      navigate(`/event-details/${id}`);
    } else if (type === 'audition') {
      navigate(`/audition-details/${id}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {paymentStatus === 'loading' && (
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                )}
                {paymentStatus === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                )}
                {paymentStatus === 'failed' && (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {paymentStatus === 'loading' && 'Verifying Payment...'}
                {paymentStatus === 'success' && 'Payment Successful!'}
                {paymentStatus === 'failed' && 'Payment Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentStatus === 'loading' && (
                <p className="text-center text-muted-foreground">
                  Please wait while we verify your payment...
                </p>
              )}

              {paymentStatus === 'success' && paymentDetails && (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Your payment has been processed successfully!
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>₹{paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Transaction ID:</span>
                      <span className="text-sm">{paymentDetails.transaction_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span className="text-sm">{paymentDetails.phonepe_order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-600 capitalize">{paymentDetails.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Your payment could not be processed. Please try again.
                  </p>
                  {paymentDetails && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span className="text-sm">{paymentDetails.phonepe_order_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className="text-red-600 capitalize">{paymentDetails.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                
                {paymentStatus === 'success' && (
                  <Button onClick={handleContinue}>
                    Continue
                  </Button>
                )}

                {paymentStatus === 'failed' && (
                  <Button onClick={handleRetry}>
                    Try Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}