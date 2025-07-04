
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateOfBirthPicker } from '@/components/ui/date-of-birth-picker';
import { Eye, EyeOff } from 'lucide-react';
import { sanitizeText, isValidEmail } from '@/utils/securityUtils';

const BasicInformation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Check if user has already completed basic information
    const checkBasicInfo = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('bio, username, phone_number')
        .eq('id', user.id)
        .single();

      if (profile?.bio && profile?.username && profile?.phone_number) {
        // Basic info already completed, redirect to profile
        navigate('/profile');
      }
    };

    checkBasicInfo();
  }, [user, navigate]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUppercase) return 'Password must include an uppercase letter';
    if (!hasLowercase) return 'Password must include a lowercase letter';
    if (!hasNumber) return 'Password must include a number';
    if (!hasSymbol) return 'Password must include a symbol';
    
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username !== formData.username.toLowerCase()) {
      newErrors.username = 'Username must be all lowercase';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length > 250) {
      newErrors.bio = 'Bio must not exceed 250 characters';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Confirm password is required';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsernameAvailability = async (username: string) => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user?.id)
      .maybeSingle();

    return !existingUser;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    setIsLoading(true);

    try {
      // Check username availability
      const isUsernameAvailable = await checkUsernameAvailability(formData.username);
      if (!isUsernameAvailable) {
        setErrors({ username: 'Username is already taken' });
        setIsLoading(false);
        return;
      }

      // Update user password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (passwordError) {
        throw passwordError;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          phone_number: `+91${formData.phone_number}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      toast.success('Basic information saved successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Basic information save error:', error);
      toast.error(error.message || 'Failed to save basic information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input for security
    const sanitizedValue = field === 'bio' ? sanitizeText(value, 250) : sanitizeText(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: field === 'username' ? sanitizedValue.toLowerCase() : sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-600">
            Please provide your basic information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700 font-medium">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter your full name"
                  className="rounded-lg border-gray-300 h-12"
                />
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="choose_a_username"
                  className="rounded-lg border-gray-300 h-12"
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself... (max 250 characters)"
                className="min-h-[100px] rounded-lg border-gray-300"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formData.bio.length}/250 characters</span>
                {errors.bio && <span className="text-red-500">{errors.bio}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-gray-700 font-medium">Phone Number *</Label>
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
                  placeholder="Enter 10-digit phone number"
                  className="rounded-l-none rounded-r-lg h-12"
                />
              </div>
              {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Date of Birth (Optional)</Label>
              <DateOfBirthPicker
                date={dateOfBirth}
                onDateChange={setDateOfBirth}
                placeholder="Select your date of birth"
                className="w-full rounded-lg h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    className="pr-10 rounded-lg h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-gray-700 font-medium">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                    placeholder="Confirm password"
                    className="pr-10 rounded-lg h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password}</p>}
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one symbol (!@#$%^&*)</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Basic Information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInformation;
