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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtistCategory, ExperienceLevel, CustomLink } from "@/types/artist";

// Import our components
import ProfileHero from "@/components/profile/ProfileHero";
import UnifiedProfileView from "@/components/profile/UnifiedProfileView";

const ArtistProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the parameter is a UUID (ID) or username
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Fetch artist by username or ID
  const { 
    data: artistData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['artist-profile-by-identifier', username],
    queryFn: async () => {
      if (!username) {
        throw new Error('Username or ID is required');
      }

      const isID = isUUID(username);
      console.log('Fetching artist profile for:', isID ? 'ID' : 'username', username);

      const { data: artist, error } = await supabase
        .from('profiles')
        .select(`
          *,
          special_skills (
            id,
            skill,
            artist_id
          ),
          projects (
            id,
            artist_id,
            project_name,
            role_in_project,
            project_type,
            year_of_release,
            director_producer,
            streaming_platform,
            link,
            created_at,
            updated_at
          ),
          education_training (
            id,
            artist_id,
            qualification_name,
            institution,
            year_completed,
            is_academic,
            created_at
          ),
          media_assets (
            id,
            artist_id,
            user_id,
            file_name,
            file_type,
            file_size,
            url,
            description,
            is_video,
            is_embed,
            embed_source,
            created_at
          ),
          language_skills (
            id,
            artist_id,
            language,
            proficiency
          ),
          tools_software (
            id,
            artist_id,
            tool_name
          ),
          awards (
            id,
            artist_id,
            title,
            organization,
            year,
            description,
            created_at,
            updated_at
          )
        `)
        .eq(isID ? 'id' : 'username', username)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Database error fetching artist:', error);
        throw new Error(`Artist not found: ${error.message}`);
      }

      if (!artist) {
        throw new Error('Artist not found');
      }

      console.log('Successfully fetched artist by username:', artist.full_name);
      
      // Parse custom_links from JSON
      let customLinksArray = [];
      if (artist.custom_links) {
        try {
          const parsedLinks = typeof artist.custom_links === 'string' 
            ? JSON.parse(artist.custom_links) 
            : artist.custom_links;
          
          if (Array.isArray(parsedLinks)) {
            customLinksArray = parsedLinks.map((link: any, index: number) => ({
              id: link.id || `custom-${index}`,
              title: link.title || '',
              url: link.url || ''
            }));
          }
        } catch (e) {
          console.error('Error parsing custom_links:', e);
        }
      }

      // Map database data to match Artist type
      const mappedProjects = Array.isArray(artist.projects) 
        ? artist.projects.map(p => ({ ...p, user_id: p.artist_id }))
        : [];

      const mappedSkills = Array.isArray(artist.special_skills) 
        ? artist.special_skills.map(s => ({ 
            ...s, 
            skill_name: s.skill,
            user_id: s.artist_id 
          }))
        : [];

      const mappedLanguages = Array.isArray(artist.language_skills)
        ? artist.language_skills.map(l => ({
            ...l,
            language_name: l.language,
            user_id: l.artist_id
          }))
        : [];

      const mappedEducation = Array.isArray(artist.education_training)
        ? artist.education_training.map(e => ({ ...e, user_id: e.artist_id }))
        : [];

      const mappedMediaAssets = Array.isArray(artist.media_assets)
        ? artist.media_assets.map(m => ({
            ...m,
            asset_type: m.file_type,
            asset_url: m.url
          }))
        : [];

      const mappedTools = Array.isArray(artist.tools_software)
        ? artist.tools_software.map(t => ({ ...t, user_id: t.artist_id }))
        : [];

      const mappedAwards = Array.isArray(artist.awards)
        ? artist.awards.map(a => ({
            ...a,
            award_name: a.title,
            awarding_organization: a.organization,
            user_id: a.artist_id
          }))
        : [];
      
      return {
        ...artist,
        category: (artist.category as ArtistCategory) || 'actor',
        experience_level: (artist.experience_level as ExperienceLevel) || 'beginner',
        custom_links: customLinksArray,
        special_skills: mappedSkills,
        projects: mappedProjects,
        education: mappedEducation,
        education_training: mappedEducation,
        media_assets: mappedMediaAssets,
        language_skills: mappedLanguages,
        tools_software: mappedTools,
        awards: mappedAwards,
        skills: mappedSkills.map(s => s.skill_name)
      };
    },
    enabled: !!username,
    staleTime: 3 * 60 * 1000 // 3 minutes
  });

  // Handle missing username
  if (!username) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Invalid Artist URL</h2>
            <p className="text-gray-600 mb-4">No username was provided in the URL.</p>
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
                ? `We couldn't find an artist with ${isUUID(username) ? 'ID' : 'username'} "${username}". The profile may have been removed or the link might be incorrect.`
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
