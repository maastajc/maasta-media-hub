
import { SignInForm } from '@/components/auth/SignInForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to profile page
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Maasta</h1>
          <p className="text-muted-foreground">
            The super app for the media and entertainment industry
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;
