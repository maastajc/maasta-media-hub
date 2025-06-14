import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Eye, 
  Edit, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Plus,
  Camera,
  Settings,
  Share2,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import MediaSection from "@/components/profile/MediaSection";
import SocialLinksForm from "@/components/profile/SocialLinksForm";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import MediaUploadSection from "@/components/profile/MediaUploadSection";
import { ProfileErrorBoundary } from "@/components/profile/ProfileErrorBoundary";
import NewUserWelcome from "@/components/profile/NewUserWelcome";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { useSafeProfile } from "@/hooks/useSafeProfile";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Use the unified hook with better error handling
  const { profile: rawProfileData, isLoading, isError, error, refetch } = useArtistProfile();

  // Get safe profile data with defaults
  const profileData = useSafeProfile(rawProfileData, user?.id);

  useEffect(() => {
    if (!user) {
      // Debug: user not logged in!
      console.error("[Profile page] No user found, redirecting to sign-in.");
      navigate("/sign-in");
      return;
    }

    if (!isLoading && !isError && (!rawProfileData || !rawProfileData.full_name || rawProfileData.full_name === 'New User')) {
      console.warn("[Profile page] No profile data found or new user:", rawProfileData);
      setShowWelcome(true);
    }
    setIsInitializing(false);
  }, [user, navigate, isLoading, isError, rawProfileData]);

  // Extra debugging for errors
  useEffect(() => {
    if (isError || !user) {
      console.error("[Profile page] Error status detected:", error, "user:", user);
    }
    if (error) {
      console.error("[Profile page] Profile load error:", error);
    }
  }, [isError, error, user]);
  
  // Additional: check profile data safety
  useEffect(() => {
    if (!isLoading && profileData) {
      // Debug log safe profile
      console.log("[Profile page] Using profileData:", profileData);
      if (!profileData.id) {
        console.warn("[Profile page] WARNING: profileData.id missing!", profileData);
      }
    }
  }, [isLoading, profileData]);

  // If no user
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-500">No user session</h2>
            <p className="text-gray-600">Please sign in to view your profile.</p>
            <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  // If error loading profile
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-500">Error loading profile</h2>
            <p className="text-gray-600">{typeof error === 'object' && error && "message" in error ? (error as any).message : String(error)}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  // If profileData is undefined/null or missing required props
  if (!profileData || !profileData.id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-500">Profile not found</h2>
            <p className="text-gray-600">We couldn't find your profile information. Please try refreshing, or contact support if the problem persists.</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show welcome flow for new users
  if (showWelcome && !isLoading && !isInitializing) {
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

  // Loading state with better UX
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

  // Error boundary wrapper for profile components
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
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
      });
    }
  };

  const handleProfilePictureUpdate = async (imageUrl: string) => {
    refetch();
  };

  // Calculate profile completion percentage safely
  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    
    const factors = [
      profileData.full_name && profileData.full_name !== 'New User',
      profileData.bio,
      profileData.category,
      profileData.projects?.length > 0,
      profileData.special_skills?.length > 0,
      profileData.media_assets?.length > 0,
      profileData.education_training?.length > 0
    ];
    
    const completed = factors.filter(Boolean).length;
    return Math.round((completed / factors.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  const socialLinks = [
    { icon: Globe, url: profileData?.personal_website, label: 'Website' },
    { icon: Instagram, url: profileData?.instagram, label: 'Instagram' },
    { icon: Linkedin, url: profileData?.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: profileData?.youtube_vimeo, label: 'YouTube/Vimeo' },
  ].filter(link => link.url);

  return (
    <ProfileErrorBoundary onRetry={refetch}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-maasta-purple via-maasta-orange to-purple-600"></div>
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
              <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative bg-white p-8">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                      
                      <ProfilePictureUpload
                        currentImageUrl={profileData?.profile_picture_url}
                        userId={user?.id || ""}
                        onImageUpdate={handleProfilePictureUpdate}
                        fullName={profileData?.full_name}
                      />

                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex items-center gap-4 mb-4">
                          <h1 className="text-4xl font-bold text-gray-900">
                            {profileData?.full_name === 'New User' ? 'Complete Your Profile' : profileData?.full_name}
                          </h1>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingProfile(true)}
                            className="text-gray-500 hover:text-maasta-purple"
                          >
                            <Edit size={16} />
                          </Button>
                        </div>
                        
                        {profileData?.category && (
                          <div className="flex justify-center lg:justify-start mb-4">
                            <Badge className="bg-maasta-purple text-white px-4 py-2 text-lg font-medium rounded-full">
                              {profileData.category}
                            </Badge>
                          </div>
                        )}

                        {(profileData?.city || profileData?.state || profileData?.country) && (
                          <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                            <MapPin size={20} className="mr-2" />
                            <span className="text-lg">
                              {[profileData?.city, profileData?.state, profileData?.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}

                        {profileData?.bio && (
                          <p className="text-gray-700 mb-6 max-w-2xl">{profileData.bio}</p>
                        )}

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                          <Button 
                            onClick={handleViewPublicProfile}
                            className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-8 py-3 rounded-full font-medium"
                          >
                            <Eye className="w-5 h-5 mr-2" />
                            View Public Profile
                          </Button>
                          <Button 
                            onClick={handleShare}
                            variant="outline" 
                            className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium"
                          >
                            <Share2 className="w-5 h-5 mr-2" />
                            Share Profile
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
                          >
                            <Settings className="w-5 h-5 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>

                      {socialLinks.length > 0 && (
                        <div className="flex lg:flex-col gap-4">
                          {socialLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                              <a
                                key={`social-${index}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300"
                              >
                                <Icon size={20} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Strength Card */}
              <Card className="mt-8 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Profile Strength</h3>
                        <p className="text-sm text-gray-600">Complete your profile to attract more opportunities</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${profileData?.full_name ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-sm ${profileData?.full_name ? 'text-gray-900' : 'text-gray-500'}`}>
                        Basic Info
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${profileData?.projects?.length ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-sm ${profileData?.projects?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                        Projects
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${profileData?.special_skills?.length ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-sm ${profileData?.special_skills?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                        Skills
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${profileData?.media_assets?.length ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-sm ${profileData?.media_assets?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                        Portfolio
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-6 bg-white rounded-xl shadow-sm border">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="projects" className="rounded-lg">Projects</TabsTrigger>
                <TabsTrigger value="education" className="rounded-lg">Education</TabsTrigger>
                <TabsTrigger value="skills" className="rounded-lg">Skills</TabsTrigger>
                <TabsTrigger value="media" className="rounded-lg">Media</TabsTrigger>
                <TabsTrigger value="social" className="rounded-lg">Social</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Profile Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects</span>
                        <span className="font-semibold">{profileData?.projects?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skills</span>
                        <span className="font-semibold">{profileData?.special_skills?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Education</span>
                        <span className="font-semibold">{profileData?.education_training?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Media Assets</span>
                        <span className="font-semibold">{profileData?.media_assets?.length || 0}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Profile updated</p>
                            <p className="text-sm text-gray-600">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">New project added</p>
                            <p className="text-sm text-gray-600">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Portfolio viewed</p>
                            <p className="text-sm text-gray-600">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Basic Info</span>
                        <Badge variant={profileData?.full_name ? "default" : "secondary"}>
                          {profileData?.full_name ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Projects</span>
                        <Badge variant={profileData?.projects?.length ? "default" : "secondary"}>
                          {profileData?.projects?.length ? "Complete" : "Add Projects"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Skills</span>
                        <Badge variant={profileData?.special_skills?.length ? "default" : "secondary"}>
                          {profileData?.special_skills?.length ? "Complete" : "Add Skills"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsSection 
                  profileData={profileData} 
                  onUpdate={refetch}
                  userId={user?.id}
                />
              </TabsContent>

              <TabsContent value="education">
                <EducationSection 
                  profileData={profileData} 
                  onUpdate={refetch}
                  userId={user?.id}
                />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsSection 
                  profileData={profileData} 
                  onUpdate={refetch}
                  userId={user?.id}
                />
              </TabsContent>

              <TabsContent value="media">
                <MediaUploadSection 
                  profileData={profileData} 
                  onUpdate={refetch}
                  userId={user?.id}
                />
              </TabsContent>

              <TabsContent value="social">
                <SocialLinksForm 
                  profileData={profileData} 
                  onUpdate={refetch}
                  userId={user?.id}
                />
              </TabsContent>
            </Tabs>
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
