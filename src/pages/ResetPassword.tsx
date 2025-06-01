
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const setupPasswordReset = async () => {
      // Check if we have the required tokens from the URL
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      console.log('Reset password params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

      if (!accessToken || !refreshToken || type !== 'recovery') {
        console.error('Invalid reset link parameters');
        toast.error('Invalid reset link. Please request a new password reset.');
        navigate('/sign-in');
        return;
      }

      try {
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          toast.error('Invalid or expired reset link. Please request a new password reset.');
          navigate('/sign-in');
          return;
        }

        if (data.session) {
          console.log('Password reset session established');
          setIsValidSession(true);
        } else {
          toast.error('Unable to establish reset session. Please request a new password reset.');
          navigate('/sign-in');
        }
      } catch (error) {
        console.error('Error in password reset setup:', error);
        toast.error('Something went wrong. Please request a new password reset.');
        navigate('/sign-in');
      }
    };

    setupPasswordReset();
  }, [searchParams, navigate]);

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword() || !isValidSession) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        if (error.message.includes('session_not_found')) {
          toast.error('Your reset session has expired. Please request a new password reset.');
          navigate('/sign-in');
        } else {
          toast.error(error.message || 'Failed to update password');
        }
        return;
      }

      toast.success('Password updated successfully!');
      
      // Sign out the user so they can sign in with new password
      await supabase.auth.signOut();
      
      // Redirect to sign in page
      navigate('/sign-in');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="container max-w-screen-xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Verifying Reset Link...</h1>
            <p className="text-muted-foreground">
              Please wait while we verify your password reset link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>Choose a strong password for your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                  className={passwordError ? 'border-red-500' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                  className={passwordError ? 'border-red-500' : ''}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
