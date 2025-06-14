import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApplicationsForArtist } from "@/services/auditionApplicationService";
import { AuditionApplication } from "@/services/auditionApplicationService";

interface AuditionData {
  id: string;
  title: string;
  description: string;
  location: string;
  audition_date: string;
  deadline: string;
  compensation: string;
  requirements: string;
  status: string;
  category: string;
  experience_level: string;
  gender: string;
  age_range: string;
  cover_image_url: string;
  tags: string[];
  creator_profile: {
    full_name: string;
  };
  created_at: string;
  creator_id?: string; 
}

// Define a type for the raw data structure returned by the Supabase query
type SupabaseAuditionEntry = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  audition_date: string | null;
  deadline: string | null;
  compensation: string | null;
  requirements: string | null;
  status: string | null;
  category: string | null;
  experience_level: string | null;
  gender: string | null;
  age_range: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  creator_id: string | null; 
  created_at: string | null;
};

const Auditions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();
  const [userApplications, setUserApplications] = useState<AuditionApplication[]>([]);

  useEffect(() => {
    const fetchUserApplications = async () => {
      if (user?.id) {
        try {
          const applications = await fetchApplicationsForArtist(user.id);
          setUserApplications(applications);
        } catch (err) {
          console.error("Failed to fetch user applications:", err);
        }
      }
    };
    fetchUserApplications();
  }, [user]);

  const fetchAuditions = async () => {
    try {
      console.log('Fetching auditions...');
      setLoading(true);
      setError(null);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auditions loading timeout - please check your connection')), 15000)
      );

      const auditionsFetchPromise = supabase
        .from('auditions')
        .select(`
          id,
          title,
          description,
          location,
          audition_date,
          deadline,
          compensation,
          requirements,
          status,
          category,
          experience_level,
          gender,
          age_range,
          cover_image_url,
          tags,
          creator_id,
          created_at 
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Type the result of the fetch operation
      const fetchResult = await Promise.race([
        auditionsFetchPromise,
        timeoutPromise
      ]) as { data: SupabaseAuditionEntry[] | null, error: any | null }; 

      if (fetchResult.error) {
        console.error('Database error fetching auditions:', fetchResult.error);
        throw new Error(`Database error: ${fetchResult.error.message}`);
      }

      const auditionsData = fetchResult.data;

      if (!auditionsData || auditionsData.length === 0) {
        console.log('No auditions data returned');
        setAuditions([]);
        setLoading(false);
        return;
      }

      console.log(`Fetched ${auditionsData.length} auditions, preparing to fetch creator details...`);

      const creatorIds: string[] = [
        ...new Set(
          auditionsData
            .map((a: SupabaseAuditionEntry) => a.creator_id)
            .filter((id): id is string => typeof id === 'string' && id.length > 0)
        ),
      ];
      
      let creatorMap = new Map<string, string>();

      if (creatorIds.length > 0) {
        console.log('Fetching details for creator IDs:', creatorIds);
        const { data: creatorsData, error: creatorsError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', creatorIds); 

        if (creatorsError) {
          console.warn('Could not fetch some creator details:', creatorsError);
        } else if (creatorsData) {
          creatorsData.forEach(creator => {
            creatorMap.set(creator.id, creator.full_name || 'Unknown Creator');
          });
          console.log('Creator details fetched and mapped:', creatorMap);
        }
      } else {
        console.log('No valid creator IDs found to fetch details for.');
      }

      const auditionsWithCreators = auditionsData.map((audition: SupabaseAuditionEntry): AuditionData => {
        const creatorName = audition.creator_id ? creatorMap.get(audition.creator_id) || 'Unknown Creator' : 'Unknown Creator';
        return {
          // Spread audition data and ensure all fields are correctly typed or defaulted
          ...audition,
          description: audition.description ?? '', // Ensure description is string
          location: audition.location ?? '', // Ensure location is string
          audition_date: audition.audition_date ?? '',
          deadline: audition.deadline ?? '',
          compensation: audition.compensation ?? '',
          requirements: audition.requirements ?? '',
          status: audition.status ?? 'open',
          category: audition.category ?? '',
          experience_level: audition.experience_level ?? '',
          gender: audition.gender ?? '',
          age_range: audition.age_range ?? '',
          cover_image_url: audition.cover_image_url ?? '',
          tags: audition.tags || [], 
          creator_profile: { 
            full_name: creatorName 
          },
          created_at: audition.created_at || new Date().toISOString(),
          creator_id: audition.creator_id ?? undefined,
        };
      });

      console.log(`Successfully processed ${auditionsWithCreators.length} auditions with creator names`);
      setAuditions(auditionsWithCreators);
    } catch (error: any) {
      console.error('Error in fetchAuditions process:', error);
      setError(error.message || 'Failed to load auditions');
      setAuditions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditions();
  }, []);

  const filters = {
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
    gender: searchParams.get('gender') || '',
    ageRange: searchParams.get('ageRange') || '',
  };

  const filteredAuditions = auditions.filter(audition => {
    if (filters.category && audition.category !== filters.category) return false;
    if (filters.location && !audition.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.experience && audition.experience_level !== filters.experience) return false;
    if (filters.gender && audition.gender !== filters.gender) return false;
    if (filters.ageRange && audition.age_range !== filters.ageRange) return false;
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      const hasSelectedTag = selectedTags.some(tag => 
        audition.tags?.includes(tag)
      );
      if (!hasSelectedTag) return false;
    }
    
    return true;
  });

  // Extract unique tags from auditions
  const uniqueTags = Array.from(
    new Set(auditions.flatMap(audition => audition.tags || []))
  ).filter(Boolean);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRetry = () => {
    fetchAuditions();
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedTags([]);
  };

  const applicationStatusMap = new Map(
    userApplications.map((app) => [app.audition_id, app.status])
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading auditions...</p>
            <p className="mt-2 text-sm text-gray-500">This may take a moment</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <AuditionsHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>Error loading auditions: {error}</span>
                  <Button 
                    onClick={handleRetry}
                    size="sm"
                    variant="outline"
                    className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ArtistFilters 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                uniqueTags={uniqueTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                isLoading={loading}
              />
            </aside>
            
            <div className="flex-1">
              <AuditionsGrid 
                auditions={filteredAuditions} 
                loading={loading}
                error={error}
                onClearFilters={clearFilters}
                onRetry={handleRetry}
                applicationStatusMap={applicationStatusMap}
              />
              
              {!loading && !error && filteredAuditions.length === 0 && auditions.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No auditions found matching your criteria</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auditions;
