import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import SkillsSection from '@/components/profile/SkillsSection';
import AwardsSection from '@/components/profile/AwardsSection';

const SkillsTools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
  }, [user, navigate]);

  const handleNext = () => {
    localStorage.setItem('onboarding_step', '7');
    navigate('/onboarding/complete');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_step', '7');
    navigate('/onboarding/complete');
  };

  const handleBack = () => {
    navigate('/onboarding/online-links');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Skills, Languages, Tools & Awards</h1>
            <span className="text-sm text-muted-foreground">Step 6 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Skills, Languages & Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Skills, Languages & Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add your skills, languages you speak, and tools/software you're proficient with.
              </p>
              
              <SkillsSection 
                profileData={null} 
                onUpdate={() => {}} 
                userId={user.id}
              />
            </CardContent>
          </Card>

          {/* Awards & Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Awards & Achievements (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Showcase your awards, recognitions, and achievements.
              </p>
              
              <AwardsSection 
                profileData={null} 
                onUpdate={() => {}} 
                userId={user.id}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Skip for Now
              </Button>
              <Button onClick={handleNext}>
                Complete Profile Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsTools;