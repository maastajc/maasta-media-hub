
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useArtistProfile } from "@/hooks/useArtistProfile";

// Import our new components
import ProfileHero from "@/components/profile/ProfileHero";
import UnifiedProfileView from "@/components/profile/UnifiedProfileView";

const ArtistProfile = () => {
  const { id: artistId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    staleTime: 3 * 60 * 1000 // 3 minutes
  });

  // Handle missing artist ID
  if (!artistId) {
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
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading artist profile...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Enhanced error handling with sanitized error messages
  if (isError || !artistData) {
    const isNotFound = !artistData || error?.message?.includes('not found');
    
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
                ? `We couldn't find an artist with the requested ID. The profile may have been removed or the link might be incorrect.`
                : "We're having trouble loading this profile. Please try again."
              }
            </p>
            
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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <ProfileHero 
          artist={artistData} 
          onBack={() => navigate(-1)} 
        />

        {/* Unified Profile Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UnifiedProfileView artist={artistData} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
