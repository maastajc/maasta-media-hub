
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProfileErrorBoundary } from "@/components/profile/ProfileErrorBoundary";
import NewUserWelcome from "@/components/profile/NewUserWelcome";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { useProfilePageState } from "@/hooks/useProfilePageState";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStrengthCard from "@/components/profile/ProfileStrengthCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import React from "react";

// Helper to compute profile completion percentage
const calcCompletion = (profileData: any): number => {
  if (!profileData) return 0;
  const factors = [
    profileData.full_name && profileData.full_name !== 'New User',
    profileData.bio,
    profileData.category,
    profileData.projects?.length > 0,
    profileData.special_skills?.length > 0,
    profileData.media_assets?.length > 0,
    profileData.education_training?.length > 0,
  ];
  const completed = factors.filter(Boolean).length;
  return Math.round((completed / factors.length) * 100);
};

const Profile = () => {
  const {
    user,
    profileData,
    isLoading,
    isError,
    error,
    showWelcome,
    setShowWelcome,
    isInitializing,
    setIsEditingProfile,
    isEditingProfile,
    activeTab,
    setActiveTab,
    refetch,
    toast,
    navigate,
  } = useProfilePageState();

  // Action handlers
  const handleViewPublicProfile = () => {
    if (profileData?.id) {
      navigate(`/artists/${profileData.id}`);
    }
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/artists/${profileData?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData?.full_name || 'My'} Profile - Maasta`,
          text: `Check out my profile on Maasta`,
          url: profileUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
      });
    }
  };

  // Early returns for loading, error, no user, etc.
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-500">No user session</h2>
            <p className="text-gray-600">Please sign in to view your profile.</p>
            <button onClick={() => navigate("/sign-in")}>Sign In</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Loading Your Profile</h3>
              <p className="text-gray-600">Setting up your workspace...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle case where profile data is null but user exists (new user or profile creation needed)
  if (!profileData) {
    console.log('Profile data is null, showing welcome for new user');
    return (
      <NewUserWelcome
        userName={user.email?.split('@')[0] || 'New User'}
        onGetStarted={() => {
          setIsEditingProfile(true);
        }}
      />
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-500">Error loading profile</h2>
            <p className="text-gray-600">{typeof error === 'object' && error && "message" in error ? (error as any).message : String(error)}</p>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showWelcome && (!profileData.full_name || profileData.full_name === 'New User')) {
    return (
      <NewUserWelcome
        userName={user.email?.split('@')[0] || 'New User'}
        onGetStarted={() => {
          setShowWelcome(false);
          setIsEditingProfile(true);
        }}
      />
    );
  }

  // Render main profile
  return (
    <ProfileErrorBoundary onRetry={refetch}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-maasta-purple via-maasta-orange to-purple-600"></div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <ProfileHeader
                  profileData={profileData}
                  user={user}
                  onEdit={() => setIsEditingProfile(true)}
                  onViewPublic={handleViewPublicProfile}
                  onShare={handleShare}
                />
              </div>
              <ProfileStrengthCard
                profileData={profileData}
                completionPercentage={calcCompletion(profileData)}
              />
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProfileTabs
              profileData={profileData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              refetch={refetch}
              userId={user?.id}
            />
          </div>
          {isEditingProfile && profileData && (
            <ProfileEditForm
              profileData={profileData}
              onClose={() => setIsEditingProfile(false)}
              onUpdate={refetch}
              userId={user?.id}
            />
          )}
        </main>
        <Footer />
      </div>
    </ProfileErrorBoundary>
  );
};

export default Profile;
