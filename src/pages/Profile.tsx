import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchArtistById } from "@/services/artist/artistById";
import { UnauthenticatedProfile } from "@/components/profile/UnauthenticatedProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Brain, 
  FileText, 
  Award, 
  ExternalLink, 
  Edit,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import WorkPreferencesEditForm from "@/components/profile/WorkPreferencesEditForm";
import PortfolioLinksEditForm from "@/components/profile/PortfolioLinksEditForm";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import MediaUploadSection from "@/components/profile/MediaUploadSection";
import AwardsSection from "@/components/profile/AwardsSection";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileStrengthMeter from "@/components/profile/ProfileStrengthMeter";
import SocialLinksForm from "@/components/profile/SocialLinksForm";
import { toast } from "sonner";
import CoverImageUpload from "@/components/profile/CoverImageUpload";
import DownloadPortfolioPDF from "@/components/profile/DownloadPortfolioPDF";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isWorkPreferencesEditOpen, setIsWorkPreferencesEditOpen] = useState(false);
  const [isPortfolioLinksEditOpen, setIsPortfolioLinksEditOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [isNewUser, setIsNewUser] = useState(false);

  const {
    data: profileData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["artistProfile", user?.id],
    queryFn: () => fetchArtistById(user?.id || ""),
    enabled: !!user?.id && !authLoading,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Redirect to basic information if profile is not found
  useEffect(() => {
    if (error && error.message?.includes('not found') && user && !authLoading) {
      console.log('Profile not found, redirecting to basic information');
      navigate('/basic-information');
    }
  }, [error, user, authLoading, navigate]);

  // Check if user is new (profile incomplete) and auto-trigger edit form
  useEffect(() => {
    if (profileData && user && !authLoading) {
      // Check if profile has minimal required information
      const hasBasicInfo = profileData.bio && profileData.date_of_birth && profileData.username;
      
      if (!hasBasicInfo) {
        setIsNewUser(true);
        // Auto-trigger edit form after 2 seconds for new users
        const timer = setTimeout(() => {
          setIsEditFormOpen(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [profileData, user, authLoading]);

  useEffect(() => {
    if (profileData) {
      // Force cache-busted URLs for both profile and cover images
      const imageUrl = profileData.profile_picture_url ? 
        `${profileData.profile_picture_url}${profileData.profile_picture_url.includes('?') ? '&' : '?'}t=${Date.now()}` : 
        undefined;
      setProfileImageUrl(imageUrl);
      
      const coverUrl = profileData.cover_image_url ? 
        `${profileData.cover_image_url}${profileData.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}` : 
        undefined;
      setCoverImageUrl(coverUrl);
    }
  }, [profileData]);

  const handleProfileUpdate = async () => {
    await refetch();
    // Also invalidate other related queries
    await queryClient.invalidateQueries({ queryKey: ['artist-profile', user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['featured-artists'] });
    toast.success("Profile updated successfully!");
  };

  const handleViewPublicProfile = () => {
    if (profileData?.username) {
      // Open public profile in new tab with username
      const publicProfileUrl = `/artists/${profileData.username}`;
      window.open(publicProfileUrl, '_blank');
    } else if (profileData?.full_name && user?.id) {
      // Generate custom URL if no username
      const customUrl = generateCustomUrl(profileData.full_name, user.id);
      const publicProfileUrl = `/artists/${customUrl}`;
      window.open(publicProfileUrl, '_blank');
    } else if (profileData?.id) {
      // Fallback to ID if username is not available
      const publicProfileUrl = `/artists/${profileData.id}`;
      window.open(publicProfileUrl, '_blank');
    }
  };

  const handleProfileImageUpdate = async (imageUrl: string) => {
    // Add cache-busting timestamp
    const cacheBustedUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    setProfileImageUrl(cacheBustedUrl);
    
    // Invalidate all profile-related queries to ensure updates everywhere
    await queryClient.invalidateQueries({ queryKey: ["artistProfile", user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['artist-profile', user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['featured-artists'] });
    
    // Force refetch to get updated data
    await refetch();
  };

  const handleCoverImageUpdate = async (imageUrl: string | null) => {
    // Add cache-busting timestamp
    const cacheBustedUrl = imageUrl ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : null;
    setCoverImageUrl(cacheBustedUrl || undefined);
    
    // Invalidate all profile-related queries to ensure updates everywhere
    await queryClient.invalidateQueries({ queryKey: ["artistProfile", user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['artist-profile', user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['featured-artists'] });
    
    // Force refetch to get updated data
    await refetch();
  };

  const generateCustomUrl = (fullName: string, userId: string) => {
    // Try to create URL from full name first
    const sanitizedName = fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 20);
    
    if (sanitizedName.length >= 3) {
      return sanitizedName;
    }
    
    // Fallback to guest with user ID suffix
    return `guest-${userId.substring(0, 8)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Scroll spy functionality - Updated section order
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'media', 'projects', 'social', 'education', 'skills', 'awards'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (error && !error.message?.includes('not found')) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  }, [error]);

  // Show unauthenticated view if no user
  if (!authLoading && !user) {
    return <UnauthenticatedProfile />;
  }

  // Show loading while auth is loading or profile is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not a "not found" error (those are handled by redirect)
  if (error && !error.message?.includes('not found')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center p-4 py-20">
          <Alert className="max-w-md">
            <AlertDescription>
              Failed to load profile. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // If no profile data and no error, show empty state
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Setting up your profile...</p>
              <Button 
                onClick={() => navigate('/basic-information')} 
                className="mt-4"
              >
                Complete Profile Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Cover Image Section */}
      <CoverImageUpload
        currentImageUrl={profileData?.cover_image_url}
        onImageUpdate={handleCoverImageUpdate}
        userId={user?.id || ""}
      />
      
      {/* Profile Header */}
      <div className="bg-white border-b relative -mt-20 z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <ProfilePictureUpload
                    currentImageUrl={profileData?.profile_picture_url}
                    onImageUpdate={handleProfileImageUpdate}
                    userId={user?.id || ""}
                    fullName={profileData.full_name}
                  />
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {profileData.full_name}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        {profileData.category && (
                          <Badge variant="secondary" className="bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20">
                            {profileData.category.charAt(0).toUpperCase() + profileData.category.slice(1)}
                          </Badge>
                        )}
                        
                        {(profileData.city || profileData.state || profileData.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>
                              {[profileData.city, profileData.state, profileData.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {profileData.years_of_experience !== undefined && profileData.experience_level && (
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>
                              {profileData.years_of_experience > 0 ? `${profileData.years_of_experience} year${profileData.years_of_experience !== 1 ? 's' : ''} • ` : ''}
                              {profileData.experience_level.charAt(0).toUpperCase() + profileData.experience_level.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {profileData.bio && (
                        <p className="text-gray-700 leading-relaxed max-w-2xl mb-4">
                          {profileData.bio}
                        </p>
                      )}

                      {/* Contact & Social Links */}
                      <div className="flex flex-wrap gap-4">
                        {profileData.phone_number && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{profileData.phone_number}</span>
                          </div>
                        )}
                        {profileData.personal_website && (
                          <a 
                            href={profileData.personal_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-maasta-orange hover:underline"
                          >
                            <Globe size={14} />
                            <span>Website</span>
                          </a>
                        )}
                        {profileData.instagram && (
                          <a 
                            href={profileData.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-maasta-orange hover:underline"
                          >
                            <Instagram size={14} />
                            <span>Instagram</span>
                          </a>
                        )}
                        {profileData.linkedin && (
                          <a 
                            href={profileData.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-maasta-orange hover:underline"
                          >
                            <Linkedin size={14} />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <DownloadPortfolioPDF 
                        artist={profileData}
                        variant="default"
                        className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                      />
                      <Button
                        onClick={handleViewPublicProfile}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        View Public Profile
                      </Button>
                      <Button 
                        onClick={() => setIsEditFormOpen(true)}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Strength Meter */}
      <div className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <ProfileStrengthMeter 
            artist={profileData}
            showActionButton={true}
          />
        </div>
      </div>

      {/* Fixed Navigation Tabs - Updated order */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-0 rounded-none border-0 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-overview')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <User size={16} />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-media')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Briefcase size={16} />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-social')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-education')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <GraduationCap size={16} />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state-active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-skills')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Brain size={16} />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="awards" 
                className="flex items-center gap-2 py-4 border-b-2 border-transparent data-[state=active]:border-maasta-orange data-[state=active]:bg-transparent rounded-none"
                onClick={() => document.getElementById('section-awards')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Award size={16} />
                <span className="hidden sm:inline">Awards</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Profile Content - Reordered sections */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Overview Section */}
        <div id="section-overview" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information with Edit Icon */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditFormOpen(true)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit size={16} className="text-gray-500" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Full Name:</span>
                      <p className="text-gray-900">{profileData.full_name}</p>
                    </div>
                    {profileData.bio && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Bio:</span>
                        <p className="text-gray-900">{profileData.bio}</p>
                      </div>
                    )}
                    {profileData.phone_number && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <p className="text-gray-900">{profileData.phone_number}</p>
                      </div>
                    )}
                    {(profileData.city || profileData.state || profileData.country) && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Location:</span>
                        <p className="text-gray-900">
                          {[profileData.city, profileData.state, profileData.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {profileData.preferred_domains && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Available For</h3>
                    <p className="text-gray-700">{profileData.preferred_domains}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Hidden on mobile */}
            <div className="space-y-6 hidden lg:block">
              {/* Work Preferences with Edit Icon */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Work Preferences</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsWorkPreferencesEditOpen(true)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit size={16} className="text-gray-500" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {profileData.work_preference && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Work Type:</span>
                        <p className="text-gray-900 capitalize">{profileData.work_preference.replace('_', ' ')}</p>
                      </div>
                    )}
                    {profileData.experience_level && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Experience:</span>
                        <p className="text-gray-900 capitalize">{profileData.experience_level}</p>
                      </div>
                    )}
                    {profileData.years_of_experience !== undefined && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Years:</span>
                        <p className="text-gray-900">{profileData.years_of_experience} years</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div id="section-media" className="scroll-mt-24">
          <MediaUploadSection 
            profileData={profileData} 
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
          />
        </div>

        {/* Projects Section */}
        <div id="section-projects" className="scroll-mt-24">
          <ProjectsSection 
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
            isOwnProfile={true}
          />
        </div>

        {/* Social Links Section */}
        <div id="section-social" className="scroll-mt-24">
          <SocialLinksForm 
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
          />
        </div>

        {/* Education Section */}
        <div id="section-education" className="scroll-mt-24">
          <EducationSection 
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
          />
        </div>

        {/* Skills Section */}
        <div id="section-skills" className="scroll-mt-24">
          <SkillsSection 
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
          />
        </div>

        {/* Awards Section - Fixed to render properly */}
        <div id="section-awards" className="scroll-mt-24">
          <AwardsSection 
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            userId={user?.id || ""}
          />
        </div>
      </div>

      {/* Profile Edit Forms */}
      {isEditFormOpen && (
        <ProfileEditForm
          open={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={handleProfileUpdate}
          profileData={profileData}
        />
      )}

      {isWorkPreferencesEditOpen && (
        <WorkPreferencesEditForm
          open={isWorkPreferencesEditOpen}
          onClose={() => setIsWorkPreferencesEditOpen(false)}
          onSuccess={handleProfileUpdate}
          profileData={profileData}
        />
      )}

      {isPortfolioLinksEditOpen && (
        <PortfolioLinksEditForm
          open={isPortfolioLinksEditOpen}
          onClose={() => setIsPortfolioLinksEditOpen(false)}
          onSuccess={handleProfileUpdate}
          profileData={profileData}
        />
      )}
      <Footer />
    </div>
  );
};

export default Profile;
