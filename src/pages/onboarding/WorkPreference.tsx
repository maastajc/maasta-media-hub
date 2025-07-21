import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const WorkPreference = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    work_preference: '',
    willing_to_relocate: false,
    preferred_domains: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'actor', 'director', 'producer', 'cinematographer', 'editor', 'writer',
    'musician', 'dancer', 'singer', 'voice_artist', 'model', 'photographer',
    'makeup_artist', 'costume_designer', 'art_director', 'sound_engineer'
  ];

  const workTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'any', label: 'Any' }
  ];

  const industryTypes = [
    'Cinema', 'Theatre', 'Advertising', 'Television', 'Web Series', 
    'Music Videos', 'Documentary', 'Corporate Videos', 'Fashion', 'Photography'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Load existing data
    const loadExistingData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('category, work_preference, willing_to_relocate, preferred_domains')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          category: profile.category || '',
          work_preference: profile.work_preference || '',
          willing_to_relocate: profile.willing_to_relocate || false,
          preferred_domains: profile.preferred_domains || ''
        });
      }
    };

    loadExistingData();
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Please select your primary profession';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          category: formData.category,
          work_preference: formData.work_preference,
          willing_to_relocate: formData.willing_to_relocate,
          preferred_domains: formData.preferred_domains,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      localStorage.setItem('onboarding_step', '3');
      navigate('/onboarding/media-portfolio');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;
    
    // Save any partial data that exists
    try {
      const updateData: any = {};
      if (formData.category) updateData.category = formData.category;
      if (formData.work_preference) updateData.work_preference = formData.work_preference;
      if (formData.willing_to_relocate !== false) updateData.willing_to_relocate = formData.willing_to_relocate;
      if (formData.preferred_domains) updateData.preferred_domains = formData.preferred_domains;
      
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        await supabase.from('profiles').update(updateData).eq('id', user.id);
      }
      
      localStorage.setItem('onboarding_step', '3');
      navigate('/onboarding/media-portfolio');
    } catch (error) {
      console.error('Error saving partial data:', error);
      // Continue to next step even if save fails
      localStorage.setItem('onboarding_step', '3');
      navigate('/onboarding/media-portfolio');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/basic-info');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Work Preferences & Profession</h1>
            <span className="text-sm text-muted-foreground">Step 2 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '33.33%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tell us about your work preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Primary Profession *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary profession" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label>Work Type Preference</Label>
              <Select value={formData.work_preference} onValueChange={(value) => setFormData(prev => ({ ...prev, work_preference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work type preference" />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Industry Type</Label>
              <Select value={formData.preferred_domains} onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_domains: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryTypes.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="relocate"
                checked={formData.willing_to_relocate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, willing_to_relocate: checked as boolean }))}
              />
              <Label htmlFor="relocate">I'm willing to relocate for work opportunities</Label>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                  Skip for Now
                </Button>
                <Button onClick={handleNext} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Next: Media Portfolio'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkPreference;