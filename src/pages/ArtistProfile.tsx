
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
  GraduationCap
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

  // Use the unified hook for data fetching
  const { 
    profile: artistData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useArtistProfile(artistId, {
    enabled: !!artistId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Handle missing artist ID
  if (!artistId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Invalid Artist ID</h2>
            <p className="text-gray-600 mb-4">No artist ID was provided in the URL.</p>
            <Button onClick={() => navigate("/artists")}>
              Browse Artists
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  // Error state with retry option
  if (isError || !artistData) {
    const errorMessage = error?.message || "Artist profile not found";
    const isNotFound = errorMessage.includes('not found') || !artistData;
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">
              {isNotFound ? "Artist Not Found" : "Error Loading Profile"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isNotFound 
                ? "The artist profile you're looking for doesn't exist or may have been removed."
                : errorMessage
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/artists")} variant="outline">
                Browse Artists
              </Button>
              {!isNotFound && (
                <Button onClick={() => refetch()}>
                  Try Again
                </Button>
              )}
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

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
