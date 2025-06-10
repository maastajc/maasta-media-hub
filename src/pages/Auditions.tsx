
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
}

const Auditions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchAuditions = async () => {
    try {
      console.log('Fetching auditions...');
      setLoading(true);
      setError(null);

      // Reduced timeout for better UX
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auditions loading timeout - please check your connection')), 8000)
      );

      const fetchPromise = supabase
        .from('auditions')
        .select(`
          *,
          creator_profile:artist_details!auditions_creator_id_fkey(full_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data, error: fetchError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (fetchError) {
        console.error('Database error fetching auditions:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!data) {
        console.log('No auditions data returned');
        setAuditions([]);
        return;
      }

      // Transform data with safe defaults
      const transformedAuditions = (data || []).map((audition: any) => ({
        ...audition,
        tags: audition.tags || [],
        creator_profile: {
          full_name: audition.creator_profile?.full_name || 'Unknown Creator'
        }
      }));

      console.log(`Successfully fetched ${transformedAuditions.length} auditions`);
      setAuditions(transformedAuditions);
    } catch (error: any) {
      console.error('Error fetching auditions:', error);
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
