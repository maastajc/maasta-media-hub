
import { useAuth } from '@/contexts/AuthContext';
import UnifiedProfileView from '@/components/profile/UnifiedProfileView';
import { ProfileErrorBoundary } from '@/components/profile/ProfileErrorBoundary';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtistProfile } from '@/hooks/useArtistProfile';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: artist, isLoading: artistLoading, error } = useArtistProfile(user?.id);

  useEffect(() => {
    // If not loading and no user, redirect to sign-in
    if (!loading && !user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication or fetching profile
  if (loading || artistLoading) {
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

  // If there's an error or no artist data, show error state
  if (error || !artist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileErrorBoundary>
      <UnifiedProfileView artist={artist} isOwnProfile={true} />
    </ProfileErrorBoundary>
  );
};

export default Profile;
