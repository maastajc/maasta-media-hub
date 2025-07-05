
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailVerificationPopupProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onResendEmail?: () => void;
  isResending?: boolean;
}

export const EmailVerificationPopup = ({ 
  open, 
  onClose, 
  email, 
  onResendEmail,
  isResending = false 
}: EmailVerificationPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Mail className="w-5 h-5 text-blue-500" />
            Verify Your Email Address
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            
            <p className="text-gray-700 mb-2">
              We've sent a confirmation link to:
            </p>
            <p className="font-semibold text-gray-900 mb-4">
              {email}
            </p>
            
            <p className="text-sm text-gray-600">
              Please check your inbox and click the verification link to continue using your account.
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-orange-700">
                <p className="font-medium">Don't see the email?</p>
                <p>Check your spam folder or click resend below.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {onResendEmail && (
            <Button
              variant="outline"
              onClick={onResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
          
          <Button
            onClick={onClose}
            className="w-full bg-[#ff8200] hover:bg-[#ff8200]/90 text-white"
          >
            I'll verify later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
