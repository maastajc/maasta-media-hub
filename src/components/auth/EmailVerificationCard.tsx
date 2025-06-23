
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { getEmailVerificationStatus, sendVerificationEmail, EmailVerificationStatus } from '@/services/emailVerificationService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EmailVerificationCardProps {
  onVerificationChange?: (isVerified: boolean) => void;
}

export const EmailVerificationCard = ({ onVerificationChange }: EmailVerificationCardProps) => {
  const [status, setStatus] = useState<EmailVerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadVerificationStatus = async () => {
    setIsLoading(true);
    const verificationStatus = await getEmailVerificationStatus();
    setStatus(verificationStatus);
    setIsLoading(false);
    
    if (verificationStatus && onVerificationChange) {
      onVerificationChange(verificationStatus.isVerified);
    }
  };

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const handleSendVerification = async () => {
    setIsSending(true);
    const success = await sendVerificationEmail();
    setIsSending(false);
    
    if (success) {
      // Optionally reload status after sending
      setTimeout(loadVerificationStatus, 1000);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <LoadingSpinner size="sm" className="mr-2" />
          Loading verification status...
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          Unable to load verification status
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Verification
        </CardTitle>
        <CardDescription>
          Verify your email address to post auditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email: {status.email}</p>
            {status.isVerified && status.verifiedAt && (
              <p className="text-xs text-gray-500">
                Verified on {new Date(status.verifiedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div>
            {status.isVerified ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
        </div>

        {!status.isVerified && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You need to verify your email address before you can post auditions.
            </p>
            <Button 
              onClick={handleSendVerification}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending Verification Email...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Verification Email
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
