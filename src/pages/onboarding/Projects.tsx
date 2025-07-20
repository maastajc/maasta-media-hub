import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ProjectsSection from '@/components/profile/ProjectsSection';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
  }, [user, navigate]);

  const handleNext = () => {
    localStorage.setItem('onboarding_step', '5');
    navigate('/onboarding/online-links');
  };

  const handleBack = () => {
    navigate('/onboarding/media-portfolio');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Projects & Work Samples</h1>
            <span className="text-sm text-muted-foreground">Step 4 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '66.67%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Your Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Showcase your work by adding projects you've been involved in. Include details like title, description, year, and any relevant links.
            </p>

            <ProjectsSection 
              profileData={null} 
              onUpdate={() => {}} 
              userId={user.id}
            />

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Next: Online Presence & Links
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;