
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, AlertCircle } from "lucide-react";
import { getEmailVerificationStatus } from '@/services/emailVerificationService';

const AuditionsHeader = () => {
  const { profile, user } = useAuth();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const isRecruiter = profile?.role === 'recruiter';

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!user) {
        setIsCheckingVerification(false);
        return;
      }

      try {
        const status = await getEmailVerificationStatus();
        setIsEmailVerified(status?.isVerified || false);
      } catch (error) {
        console.error('Error checking email verification:', error);
        setIsEmailVerified(false);
      } finally {
        setIsCheckingVerification(false);
      }
    };

    checkEmailVerification();
  }, [user]);

  const canPostAuditions = user && isEmailVerified;

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audition Listings</h1>
            <p className="mt-1 text-md text-gray-600">
              Discover your next role from our curated list of opportunities.
            </p>
          </div>
          
          {user && (
            <div className="flex flex-col items-end gap-2">
              {canPostAuditions ? (
                <Button asChild>
                  <Link to="/auditions/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post an Audition
                  </Link>
                </Button>
              ) : (
                <div className="text-right">
                  <Button asChild variant="outline" disabled={isCheckingVerification}>
                    <Link to="/auditions/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post an Audition
                    </Link>
                  </Button>
                  {!isCheckingVerification && !isEmailVerified && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Email verification required
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditionsHeader;
