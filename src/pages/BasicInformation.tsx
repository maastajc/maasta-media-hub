
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button as CalendarButton } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const BasicInformation = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone_number: '',
    date_of_birth: null as Date | null,
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Auto-fill fields from user metadata and profile
    const userData = user.user_metadata || {};
    const phoneFromMeta = userData.phone_number || user.phone || '';
    
    setFormData({
      full_name: userData.full_name || profile?.full_name || '',
      username: userData.username || profile?.username || '',
      bio: profile?.bio || '',
      phone_number: phoneFromMeta.replace('+91', ''), // Remove country code for display
      date_of_birth: profile?.date_of_birth ? new Date(profile.date_of_birth) : null,
      password: '',
      confirmPassword: ''
    });
  }, [user, profile, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
    }

    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Update profile data
      const profileUpdateData = {
        full_name: formData.full_name,
        username: formData.username,
        bio: formData.bio,
        phone_number: formData.phone_number ? `+91${formData.phone_number}` : null,
        date_of_birth: formData.date_of_birth?.toISOString().split('T')[0] || null,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', user!.id);

      if (profileError) {
        throw profileError;
      }

      // Update password if provided
      if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });

        if (passwordError) {
          throw passwordError;
        }
      }

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Complete Your Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Fill in your basic information to get started
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="rounded-lg"
                    required
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                    placeholder="Enter username (lowercase)"
                    className="rounded-lg"
                    required
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="rounded-lg resize-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-lg">
                      <span className="text-sm text-gray-600">+91</span>
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
                      placeholder="Enter 10-digit number"
                      className="rounded-l-none rounded-r-lg"
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-sm text-red-500">{errors.phone_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <CalendarButton
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-lg",
                          !formData.date_of_birth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date_of_birth ? (
                          format(formData.date_of_birth, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </CalendarButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date_of_birth}
                        onSelect={(date) => setFormData(prev => ({ ...prev, date_of_birth: date || null }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter new password"
                    className="rounded-lg"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className="rounded-lg"
                    disabled={!formData.password}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="flex-1 rounded-lg"
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#ff8200] hover:bg-[#ff8200]/90 text-white rounded-lg"
                >
                  {isLoading ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicInformation;
