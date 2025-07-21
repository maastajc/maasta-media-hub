import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Instagram, Youtube } from 'lucide-react';
import MyWorksLinksSection from '@/components/profile/MyWorksLinksSection';

const OnlineLinks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    instagram: '',
    youtube_vimeo: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Load existing data
    const loadExistingData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('instagram, youtube_vimeo')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          instagram: profile.instagram || '',
          youtube_vimeo: profile.youtube_vimeo || ''
        });
      }
    };

    loadExistingData();
  }, [user, navigate]);

  const handleNext = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Save social media links
      const { error } = await supabase
        .from('profiles')
        .update({
          instagram: formData.instagram || null,
          youtube_vimeo: formData.youtube_vimeo || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      localStorage.setItem('onboarding_step', '6');
      navigate('/onboarding/skills-tools');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save social links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;
    
    // Save any partial data that exists
    try {
      const updateData: any = {};
      if (formData.instagram) updateData.instagram = formData.instagram;
      if (formData.youtube_vimeo) updateData.youtube_vimeo = formData.youtube_vimeo;
      
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        await supabase.from('profiles').update(updateData).eq('id', user.id);
      }
      
      localStorage.setItem('onboarding_step', '6');
      navigate('/onboarding/skills-tools');
    } catch (error) {
      console.error('Error saving partial data:', error);
      // Continue to next step even if save fails
      localStorage.setItem('onboarding_step', '6');
      navigate('/onboarding/skills-tools');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/projects');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Online Presence & Portfolio Links</h1>
            <span className="text-sm text-muted-foreground">Step 5 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '83.33%' }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_vimeo" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube / Vimeo
                </Label>
                <Input
                  id="youtube_vimeo"
                  value={formData.youtube_vimeo}
                  onChange={(e) => handleInputChange('youtube_vimeo', e.target.value)}
                  placeholder="https://youtube.com/channel/... or https://vimeo.com/..."
                />
              </div>
            </CardContent>
          </Card>

          {/* My Works Links */}
          <Card>
            <CardHeader>
              <CardTitle>My Works Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add links to your external work and projects with custom titles. Supported platforms include YouTube, Vimeo, Behance, Google Drive, and more.
              </p>
              
              <MyWorksLinksSection 
                userId={user.id}
                isOwnProfile={true}
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
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Next: Skills & Tools'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineLinks;