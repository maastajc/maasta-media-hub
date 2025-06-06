
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  AlertCircle,
  Award,
  User,
  Camera,
  GraduationCap,
  RefreshCw
} from "lucide-react";
import { useArtistProfile } from "@/hooks/useArtistProfile";

// Import our new components
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import MediaUploadSection from "@/components/profile/MediaUploadSection";

const ArtistProfile = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add debug logging
  console.log('ArtistProfile component loaded');
  console.log('URL artistId:', artistId);
  console.log('Current location:', window.location.href);

  // Use the unified hook for data fetching with enhanced error handling
  const { 
    profile: artistData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useArtistProfile(artistId, {
    enabled: !!artistId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`Artist profile fetch attempt ${failureCount + 1} failed:`, error);
      
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found') || error?.message?.includes('NOT_FOUND')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });

  // Handle missing artist ID
  if (!artistId) {
    console.error('No artistId found in URL params');
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Invalid Artist URL</h2>
            <p className="text-gray-600 mb-4">No artist ID was provided in the URL.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/artists")}>
                Browse Artists
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                Go Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    console.log('Loading artist profile...');
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading artist profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Enhanced error handling with detailed error information
  if (isError || !artistData) {
    const errorMessage = error?.message || "Artist profile not found";
    const isNotFound = errorMessage.includes('not found') || 
                       errorMessage.includes('NOT_FOUND') || 
                       !artistData;
    
    console.error('Artist profile error:', {
      error: errorMessage,
      artistId,
      isNotFound,
      currentUrl: window.location.href
    });
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-lg">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">
              {isNotFound ? "Artist Not Found" : "Error Loading Profile"}
            </h2>
            <p className="text-gray-600 mb-4">
              {isNotFound 
                ? `We couldn't find an artist with ID: ${artistId}. The profile may have been removed or the link might be incorrect.`
                : `Error: ${errorMessage}`
              }
            </p>
            
            {/* Debug information for development */}
            <details className="mb-6 text-left bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">Debug Information</summary>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong>Artist ID:</strong> {artistId}</p>
                <p><strong>Current URL:</strong> {window.location.href}</p>
                <p><strong>Error:</strong> {errorMessage}</p>
                <p><strong>Is Not Found:</strong> {isNotFound ? 'Yes' : 'No'}</p>
              </div>
            </details>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => navigate("/artists")} variant="outline">
                Browse All Artists
              </Button>
              {!isNotFound && (
                <Button onClick={() => refetch()} className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Try Again
                </Button>
              )}
              <Button onClick={() => navigate("/")} variant="secondary">
                Go Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state - render the profile
  console.log('Successfully loaded artist profile:', artistData.full_name);

  const projects = artistData.projects || [];
  const education = artistData.education_training || [];
  const hasContent = projects.length > 0 || education.length > 0 || 
                    (artistData.special_skills?.length || 0) > 0 || 
                    (artistData.media_assets?.length || 0) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <ProfileHero 
          artist={artistData} 
          onBack={() => navigate(-1)} 
        />

        {/* Stats Section */}
        <ProfileStats artist={artistData} />

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="grid grid-cols-4 bg-white rounded-xl shadow-sm border w-full max-w-md mx-auto">
              <TabsTrigger value="about" className="rounded-lg flex items-center gap-2">
                <User size={16} />
                About
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-lg flex items-center gap-2">
                <Award size={16} />
                Projects
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg flex items-center gap-2">
                <Camera size={16} />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="education" className="rounded-lg flex items-center gap-2">
                <GraduationCap size={16} />
                Education
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <ProfileAbout artist={artistData} />
            </TabsContent>

            <TabsContent value="projects">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProjectsSection 
                  profileData={artistData} 
                  onUpdate={refetch}
                  userId={artistData.id}
                />
              </div>
            </TabsContent>

            <TabsContent value="media">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <MediaUploadSection 
                  profileData={artistData} 
                  onUpdate={refetch}
                  userId={artistData.id}
                />
              </div>
            </TabsContent>

            <TabsContent value="education">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <EducationSection 
                  profileData={artistData} 
                  onUpdate={refetch}
                  userId={artistData.id}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {!hasContent && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Coming Soon</h3>
                <p className="text-gray-600">
                  This artist is still building their profile. Check back later for updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
