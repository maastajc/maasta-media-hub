import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import CoverImageUpload from '@/components/profile/CoverImageUpload';

const BasicInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    city: '',
    state: '',
    country: '',
    phone_number: '',
    gender: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Load existing data if any
    const loadExistingData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          headline: profile.headline || '',
          city: profile.city || '',
          state: profile.state || '',
          country: profile.country || '',
          phone_number: profile.phone_number?.replace('+91', '') || '',
          gender: profile.gender || ''
        });
        
        if (profile.date_of_birth) {
          setDate(new Date(profile.date_of_birth));
        }
      }
    };

    loadExistingData();
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.headline.trim()) {
      newErrors.headline = 'Headline is required';
    } else if (formData.headline.length > 150) {
      newErrors.headline = 'Headline must be 150 characters or less';
    }

    if (!date) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
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
          full_name: formData.full_name,
          headline: formData.headline,
          date_of_birth: date?.toISOString().split('T')[0],
          city: formData.city,
          state: formData.state,
          country: formData.country,
          phone_number: formData.phone_number ? `+91${formData.phone_number}` : null,
          gender: formData.gender || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Store onboarding progress
      localStorage.setItem('onboarding_step', '2');
      
      navigate('/onboarding/work-preference');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>
            <span className="text-sm text-muted-foreground">Step 1 of 6</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '16.67%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information & Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex justify-center">
              <ProfilePictureUpload 
                currentImageUrl=""
                userId={user.id}
                onImageUpdate={() => {}}
                fullName={formData.full_name}
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label>Cover Photo (Optional)</Label>
              <CoverImageUpload 
                currentImageUrl=""
                userId={user.id}
                onImageUpdate={() => {}}
              />
            </div>

            {/* Basic Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline / Short Bio * (150 characters max)</Label>
              <Textarea
                id="headline"
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                placeholder="e.g., Versatile actor with 5+ years in theatre and film"
                maxLength={150}
                className="h-20"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formData.headline.length}/150 characters</span>
                {errors.headline && <span className="text-destructive">{errors.headline}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={2010}
                  />
                </PopoverContent>
              </Popover>
              {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="India"
                />
                {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">+91</span>
                </div>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      handleInputChange('phone_number', value);
                    }
                  }}
                  placeholder="Enter 10-digit phone number"
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Skip for Now
              </Button>
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Next: Work Preferences'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfo;