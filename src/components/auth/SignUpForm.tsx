
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { EmailVerificationPopup } from './EmailVerificationPopup';
import { sendVerificationEmail } from '@/services/emailVerificationService';
import { WORK_PREFERENCE_CATEGORIES } from '@/constants/workPreferences';

export const SignUpForm = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('artist');
  const [workPreferences, setWorkPreferences] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const navigate = useNavigate();

  const validatePhoneNumber = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    // Check for at least one digit
    if (!/\d/.test(password)) {
      setPasswordError('Password must contain at least one digit');
      return false;
    }
    // Check for at least one special character
    if (!/[@#!$%^&*()_+\-=\[\]{}|;':"\\|,.<>\/?]/.test(password)) {
      setPasswordError('Password must contain at least one special character (@, #, !, etc.)');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateUsername = async () => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (username.length > 30) {
      setUsernameError('Username must be at most 30 characters');
      return false;
    }
    // Check if username contains uppercase letters
    if (/[A-Z]/.test(username)) {
      setUsernameError('Username must be lowercase only');
      return false;
    }
    // Check if username contains spaces or special characters (except underscore)
    if (!/^[a-z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain lowercase letters, numbers, and underscores');
      return false;
    }

    // Check if username is already taken
    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
      return false;
    }

    if (existingUser) {
      setUsernameError('Username is already taken');
      return false;
    }

    setUsernameError('');
    return true;
  };

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      await sendVerificationEmail();
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    const isUsernameValid = await validateUsername();
    if (!isUsernameValid) {
      return;
    }

    if (!validatePhoneNumber()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            role,
            phone_number: `+91${phoneNumber}`,
            work_preferences: workPreferences,
          },
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });

      if (error) {
        throw error;
      }

      // Show email verification popup
      setShowEmailVerification(true);
      toast.success('Account created successfully! Please verify your email.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      
      const currentDomain = window.location.origin;
      const redirectUrl = currentDomain.includes('localhost') 
        ? 'https://preview--maasta-media-hub.lovable.app/profile'
        : `${currentDomain}/profile`;

      console.log('Google sign-up redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      toast.error('Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    navigate('/profile');
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Start your journey in the entertainment industry
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="lowercase_username_only"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="rounded-lg"
                required
              />
              {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-lg">
                  <span className="text-sm text-gray-600">+91</span>
                </div>
                <Input
                  id="phoneNumber"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  className="rounded-l-none rounded-r-lg"
                  required
                />
              </div>
              {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">User Type</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="rounded-lg">
                  <SelectValue placeholder="Select your user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="event_organizer">Event Organizer</SelectItem>
                  <SelectItem value="casting_agent">Casting Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPreferences">Work Preferences</Label>
              <MultiSelect
                options={WORK_PREFERENCE_CATEGORIES}
                selected={workPreferences}
                onChange={setWorkPreferences}
                placeholder="Select your work preferences..."
                searchPlaceholder="Search preferences..."
                emptyText="No preferences found."
                maxDisplay={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>

            <div className="text-sm text-gray-600 text-center leading-relaxed">
              By signing up, you agree to our{' '}
              <a 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-maasta-purple hover:text-maasta-purple/80 underline"
              >
                Terms & Conditions
              </a>
              {' '}and{' '}
              <a 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-maasta-purple hover:text-maasta-purple/80 underline"
              >
                Privacy Policy
              </a>
              .
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white rounded-lg font-semibold py-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 rounded-lg py-6 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                By continuing with Google, you agree to our{' '}
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-maasta-purple hover:text-maasta-purple/80 underline"
                >
                  Terms & Conditions
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-maasta-purple hover:text-maasta-purple/80 underline"
                >
                  Privacy Policy
                </a>
                .
              </div>
            </div>
            
            <div className="text-sm text-center mt-2">
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate('/sign-in')}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <EmailVerificationPopup
        open={showEmailVerification}
        onClose={handleEmailVerificationClose}
        email={email}
        onResendEmail={handleResendEmail}
        isResending={isResendingEmail}
      />
    </>
  );
};
