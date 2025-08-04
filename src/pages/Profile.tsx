
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedProfileView } from '@/components/profile/UnifiedProfileView';
import { ProfileErrorBoundary } from '@/components/profile/ProfileErrorBoundary';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect to sign-in
    if (!loading && !user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user after loading, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <ProfileErrorBoundary>
      <UnifiedProfileView />
    </ProfileErrorBoundary>
  );
};

export default Profile;
