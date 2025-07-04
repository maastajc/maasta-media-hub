
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Join Maasta</h1>
          <p className="text-muted-foreground">
            Create your account to access all features
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
