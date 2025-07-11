import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import CollapsibleAuditionFilters from "@/components/auditions/CollapsibleAuditionFilters";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import AuditionSearch from "@/components/auditions/AuditionSearch";
import { CacheRefreshButton } from "@/components/ui/cache-refresh-button";
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
  const [filteredAuditions, setFilteredAuditions] = useState<AuditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [compensationFilter, setCompensationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [userApplications, setUserApplications] = useState<AuditionApplication[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  const selectedCategory = searchParams.get('category') || '';

  // Search filtering function
  const filterAuditionsBySearch = (auditions: AuditionData[], query: string) => {
    if (!query.trim()) return auditions;
    
    const searchLower = query.toLowerCase();
    return auditions.filter(audition => 
      audition.title.toLowerCase().includes(searchLower) ||
      audition.description.toLowerCase().includes(searchLower) ||
      audition.location.toLowerCase().includes(searchLower) ||
      audition.requirements.toLowerCase().includes(searchLower) ||
      audition.category.toLowerCase().includes(searchLower) ||
      audition.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  };

  // Apply search filter whenever auditions or search query changes
  useEffect(() => {
    const filtered = filterAuditionsBySearch(auditions, searchQuery);
    setFilteredAuditions(filtered);
  }, [auditions, searchQuery]);

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
        location: locationFilter,
        experience: experienceFilter,
        gender: searchParams.get('gender') || '',
        ageRange: searchParams.get('ageRange') || '',
      };

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters.experience) query = query.eq('experience_level', filters.experience);
      if (filters.gender) query = query.eq('gender', filters.gender);
      if (filters.ageRange) query = query.eq('age_range', filters.ageRange);
      if (selectedTags.length > 0) query = query.contains('tags', selectedTags);
      if (compensationFilter) {
        if (compensationFilter === 'paid') {
          query = query.not('compensation', 'ilike', '%unpaid%');
        } else if (compensationFilter === 'unpaid') {
          query = query.ilike('compensation', '%unpaid%');
        }
      }

      // Apply sorting
      let orderColumn = 'created_at';
      let ascending = false;
      
      switch (sortBy) {
        case 'oldest':
          ascending = true;
          break;
        case 'deadline_soon':
          orderColumn = 'deadline';
          ascending = true;
          break;
        case 'audition_date_soon':
          orderColumn = 'audition_date';
          ascending = true;
          break;
        case 'title_asc':
          orderColumn = 'title';
          ascending = true;
          break;
        case 'title_desc':
          orderColumn = 'title';
          ascending = false;
          break;
        case 'newest':
        default:
          break;
      }

      const { data: auditionsData, error: auditionsError } = await query
        .order(orderColumn, { ascending })
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
  }, [searchParams, selectedTags, sortBy, locationFilter, experienceFilter, compensationFilter]);

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
    setSortBy("newest");
    setLocationFilter("");
    setExperienceFilter("");
    setCompensationFilter("");
    setSearchQuery("");
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Open Auditions</h2>
            <CacheRefreshButton onRefresh={handleRetry} />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <AuditionSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>Error loading auditions: {error}</span>
                  <Button 
                    onClick={() => fetchAuditions(1, true)}
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
          
          <CollapsibleAuditionFilters 
            uniqueCategories={uniqueCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSearchParams(prev => {
                if (category) {
                  prev.set('category', category);
                } else {
                  prev.delete('category');
                }
                return prev;
              }, { replace: true });
            }}
            uniqueTags={uniqueTags}
            selectedTags={selectedTags}
            toggleTag={(tag) => {
              setSelectedTags(prev => 
                prev.includes(tag) 
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            isLoading={loading && auditions.length === 0}
            sortBy={sortBy}
            setSortBy={setSortBy}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
            compensationFilter={compensationFilter}
            setCompensationFilter={setCompensationFilter}
          />
          
          <AuditionsGrid 
            auditions={filteredAuditions} 
            loading={loading && auditions.length === 0}
            error={null}
            onClearFilters={() => {
              setSearchParams(new URLSearchParams());
              setSelectedTags([]);
              setSortBy("newest");
              setLocationFilter("");
              setExperienceFilter("");
              setCompensationFilter("");
              setSearchQuery("");
            }}
            onRetry={() => fetchAuditions(1, true)}
            applicationStatusMap={applicationStatusMap}
          />
          
          {loadingMore && (
            <div className="mt-8 text-center">
              <LoadingSpinner size="md" />
            </div>
          )}
          
          {!loadingMore && hasMore && auditions.length > 0 && (
            <div className="mt-8 text-center">
              <Button onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchAuditions(nextPage, false);
              }} className="w-40">
                Load More
              </Button>
            </div>
          )}

          {!loading && !error && auditions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No auditions found matching your criteria</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auditions;
