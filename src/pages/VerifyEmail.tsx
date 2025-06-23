
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Home } from 'lucide-react';
import { verifyEmailToken } from '@/services/emailVerificationService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No verification token provided');
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const success = await verifyEmailToken(token);
        setIsVerified(success);
        if (!success) {
          setError('Invalid or expired verification token');
        }
      } catch (error) {
        setError('Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="max-w-md w-full mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Email Verification</CardTitle>
              <CardDescription>
                {isVerifying ? 'Verifying your email address...' : 'Verification complete'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : isVerified ? (
                <>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Email Verified Successfully!
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Your email has been verified. You can now post auditions.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/auditions/create')}
                      className="w-full bg-maasta-purple hover:bg-maasta-purple/90"
                    >
                      Post an Audition
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Verification Failed
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {error || 'Unable to verify your email address.'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/profile')}
                    className="w-full"
                  >
                    Go to Profile
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
