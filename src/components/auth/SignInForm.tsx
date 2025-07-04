import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidEmail, sanitizeErrorMessage, RateLimiter } from '@/utils/securityUtils';

// Create rate limiter for sign-in attempts
const signInRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes

export const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [authError, setAuthError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validateSignInForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const validateResetEmail = () => {
    if (!resetEmail.trim()) {
      setResetEmailError('Email is required');
      return false;
    } else if (!isValidEmail(resetEmail.trim())) {
      setResetEmailError('Please enter a valid email address');
      return false;
    } else {
      setResetEmailError('');
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setAuthError('');
    
    if (!validateSignInForm()) {
      return;
    }

    if (!signInRateLimiter.canProceed(email.trim())) {
      setAuthError('Too many sign-in attempts. Please wait a few minutes before trying again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn(email.trim(), password);
      if (result.error) {
        if (result.error.message.includes('Invalid login credentials') || 
            result.error.message.includes('invalid_credentials')) {
          setAuthError('Incorrect email or password. Please try again.');
        } else {
          setAuthError(sanitizeErrorMessage(result.error.message));
        }
        return;
      }
      
      signInRateLimiter.reset(email.trim());
      navigate('/profile');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials') || 
          error.message.includes('invalid_credentials')) {
        setAuthError('Incorrect email or password. Please try again.');
      } else {
        setAuthError(sanitizeErrorMessage(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      
      const currentDomain = window.location.origin;
      const redirectUrl = currentDomain.includes('localhost') 
        ? 'https://preview--maasta-media-hub.lovable.app/profile'
        : `${currentDomain}/profile`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        setAuthError(sanitizeErrorMessage(error.message));
      }
    } catch (error: any) {
      setAuthError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResetEmail()) {
      return;
    }

    setIsResetLoading(true);
    try {
      const currentUrl = window.location.origin;
      const redirectUrl = currentUrl.includes('localhost') 
        ? 'https://preview--maasta-media-hub.lovable.app/reset-password'
        : `${currentUrl}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: redirectUrl
      });

      if (error) {
        toast.error(sanitizeErrorMessage(error.message));
      } else {
        toast.success('Password reset email sent! Check your inbox and spam folder.');
        setShowForgotPassword(false);
        setResetEmail('');
        setResetEmailError('');
      }
    } catch (error: any) {
      toast.error('Failed to send reset email. Please try again later.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-800">Sign In</CardTitle>
        <CardDescription className="text-gray-600">Enter your email and password to sign in to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {authError && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (authError) setAuthError('');
              }}
              required
              className={`h-12 rounded-lg border-gray-300 ${emailError ? 'border-red-500' : ''}`}
              maxLength={254}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (authError) setAuthError('');
              }}
              required
              className={`h-12 rounded-lg border-gray-300 ${passwordError ? 'border-red-500' : ''}`}
              maxLength={128}
            />
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 h-12 rounded-lg border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
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
          </div>
          
          <div className="text-sm text-center space-y-2">
            <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 text-sm text-orange-500 hover:text-orange-600">
                  Forgot your password?
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Your email address"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        if (resetEmailError) setResetEmailError('');
                      }}
                      required
                      className={resetEmailError ? 'border-red-500' : ''}
                      maxLength={254}
                    />
                    {resetEmailError && <p className="text-sm text-red-500">{resetEmailError}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isResetLoading}>
                    {isResetLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <div>
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 text-orange-500 hover:text-orange-600" 
                onClick={() => navigate('/sign-up')}
              >
                Sign up
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
