import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, LayoutDashboard } from 'lucide-react';
import { fetchArtistById } from '@/services/artist/artistById';
import { useProfileStrength } from '@/hooks/useProfileStrength';
import { Progress } from '@/components/ui/progress';

const Complete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState<any>(null);
  const profileStrength = useProfileStrength(artistData);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Load artist data for profile strength calculation
    const loadArtistData = async () => {
      try {
        const artist = await fetchArtistById(user.id);
        setArtistData(artist);
      } catch (error) {
        console.error('Failed to load artist data:', error);
      }
    };

    loadArtistData();

    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.removeItem('onboarding_step');
  }, [user, navigate]);

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            🎉 Profile Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            Your profile is ready! You're now visible to casting agents and production houses.
          </p>

          {/* Profile Strength Meter */}
          {artistData && (
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Profile Strength</h3>
              <div className="flex items-center gap-3 mb-2">
                <Progress value={profileStrength.totalStrength} className="flex-1" />
                <span className="font-bold text-lg">
                  {Math.round(profileStrength.totalStrength)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {profileStrength.getStrengthStatus(profileStrength.totalStrength)}
              </p>
              
              {profileStrength.incompleteSections.length > 0 && (
                <div className="mt-3 text-left">
                  <p className="text-sm font-medium mb-2">To boost your profile:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {profileStrength.incompleteSections.slice(0, 3).map((section, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        {section.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleViewDashboard} className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              View Dashboard
            </Button>
            <Button onClick={handleViewProfile} variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Public Profile
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            You can always update your profile information later from your dashboard.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Complete;