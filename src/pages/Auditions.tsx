
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import AuditionFilters from "@/components/auditions/AuditionFilters";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApplicationsForArtist } from "@/services/auditionApplicationService";
import { AuditionApplication } from "@/services/auditionApplicationService";
import { toast } from "sonner";

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
  tags: string[];
  creator_profile: {
    full_name: string;
  };
  created_at: string;
  creator_id?: string; 
}

const AUDITIONS_PER_PAGE = 12;

const Auditions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();
  const [userApplications, setUserApplications] = useState<AuditionApplication[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  const selectedCategory = searchParams.get('category') || '';

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

  const fetchAuditions = async (currentPage: number, isInitialLoad = false) => {
    if (!isInitialLoad && loadingMore) return;

    if (isInitialLoad) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      console.log(`Fetching auditions page ${currentPage}...`);
      
      const from = (currentPage - 1) * AUDITIONS_PER_PAGE;
      const to = from + AUDITIONS_PER_PAGE - 1;

      // Build query
      let query = supabase
        .from('auditions')
        .select(`
          id, title, description, location, audition_date, deadline, compensation,
          requirements, status, category, experience_level, gender, age_range,
          tags, creator_id, created_at
        `)
        .eq('status', 'open');

      // Apply filters
      const filters = {
        category: searchParams.get('category') || '',
        location: searchParams.get('location') || '',
        experience: searchParams.get('experience') || '',
        gender: searchParams.get('gender') || '',
        ageRange: searchParams.get('ageRange') || '',
      };

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters.experience) query = query.eq('experience_level', filters.experience);
      if (filters.gender) query = query.eq('gender', filters.gender);
      if (filters.ageRange) query = query.eq('age_range', filters.ageRange);
      if (selectedTags.length > 0) query = query.contains('tags', selectedTags);

      const { data: auditionsData, error: auditionsError } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (auditionsError) {
        throw new Error(`Database error: ${auditionsError.message}`);
      }
      
      if (!auditionsData || auditionsData.length === 0) {
        if (isInitialLoad) setAuditions([]);
        setHasMore(false);
        return;
      }
      
      console.log(`Fetched ${auditionsData.length} auditions`);

      const processedAuditions = auditionsData.map((audition: any): AuditionData => ({
        ...audition,
        description: audition.description || '',
        location: audition.location || '',
        audition_date: audition.audition_date || '',
        deadline: audition.deadline || '',
        compensation: audition.compensation || '',
        requirements: audition.requirements || '',
        status: audition.status || 'open',
        category: audition.category || '',
        experience_level: audition.experience_level || '',
        gender: audition.gender || '',
        age_range: audition.age_range || '',
        tags: audition.tags || [],
        creator_profile: { 
          full_name: 'Production Company'
        },
        created_at: audition.created_at || new Date().toISOString(),
        creator_id: audition.creator_id || undefined,
      }));

      setAuditions(prev => isInitialLoad ? processedAuditions : [...prev, ...processedAuditions]);

      if (auditionsData.length < AUDITIONS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error: any) {
      console.error('Error fetching auditions:', error);
      const errorMessage = error.message || 'Failed to load auditions';
      setError(errorMessage);
      toast.error("Failed to load auditions. Please try again.");
      if (isInitialLoad) setAuditions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchUniqueData = async () => {
    try {
      // Fetch unique categories
      const { data: categoriesData } = await supabase
        .from('auditions')
        .select('category')
        .eq('status', 'open')
        .not('category', 'is', null);
      
      if (categoriesData) {
        const uniqueCats = Array.from(new Set(categoriesData.map(item => item.category).filter(Boolean))).sort();
        setUniqueCategories(uniqueCats as string[]);
      }

      // Fetch unique tags
      const { data: tagsData } = await supabase
        .from('auditions')
        .select('tags')
        .eq('status', 'open')
        .not('tags', 'is', null);
      
      if (tagsData) {
        const allTags = tagsData
          .flatMap(item => item.tags || [])
          .filter(tag => tag && tag.trim().length > 0);
        const uniqueTagsList = Array.from(new Set(allTags)).sort();
        setUniqueTags(uniqueTagsList);
      }
    } catch (error) {
      console.error("Error fetching unique data:", error);
    }
  };

  useEffect(() => {
    setAuditions([]);
    setPage(1);
    setHasMore(true);
    fetchAuditions(1, true);
  }, [searchParams, selectedTags]);

  useEffect(() => {
    fetchUniqueData();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAuditions(nextPage, false);
    }
  };

  const handleRetry = () => {
    setPage(1);
    fetchAuditions(1, true);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSearchParams(prev => {
      if (category) {
        prev.set('category', category);
      } else {
        prev.delete('category');
      }
      return prev;
    }, { replace: true });
  };

  const applicationStatusMap = new Map(
    userApplications.map((app) => [app.audition_id, app.status])
  );

  if (loading && auditions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading auditions...</p>
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
            <aside className="lg:w-80 flex-shrink-0">
              <AuditionFilters 
                uniqueCategories={uniqueCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                uniqueTags={uniqueTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                isLoading={loading && auditions.length === 0}
              />
            </aside>
            
            <div className="flex-1">
              <AuditionsGrid 
                auditions={auditions} 
                loading={loading && auditions.length === 0}
                error={null}
                onClearFilters={clearFilters}
                onRetry={handleRetry}
                applicationStatusMap={applicationStatusMap}
              />
              
              {loadingMore && (
                <div className="mt-8 text-center">
                  <LoadingSpinner size="md" />
                </div>
              )}
              
              {!loadingMore && hasMore && auditions.length > 0 && (
                <div className="mt-8 text-center">
                  <Button onClick={handleLoadMore} className="w-40">
                    Load More
                  </Button>
                </div>
              )}

              {!loading && !error && auditions.length === 0 && (
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
