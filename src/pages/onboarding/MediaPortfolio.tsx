import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import MediaUploadSection from '@/components/profile/MediaUploadSection';

const MediaPortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
  }, [user, navigate]);

  const handleNext = () => {
    localStorage.setItem('onboarding_step', '4');
    navigate('/onboarding/projects');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_step', '4');
    navigate('/onboarding/projects');
  };

  const handleBack = () => {
    navigate('/onboarding/work-preference');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Media Portfolio</h1>
            <span className="text-sm text-muted-foreground">Step 3 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Your Media Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Upload up to 4 media items to showcase your work. You can include images and up to 2 videos.
            </p>

            <MediaUploadSection 
              profileData={null} 
              onUpdate={() => {}} 
              userId={user.id}
            />

            <div className="flex justify-between items-center pt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                  Skip for Now
                </Button>
                <Button onClick={handleNext}>
                  Next: Projects & Work Samples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaPortfolio;