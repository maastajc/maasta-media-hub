
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import AuditionFilters from "@/components/auditions/AuditionFilters";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import { fetchAuditionsLightweight } from "@/services/optimizedAuditionService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Auditions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [applicationStatusMap, setApplicationStatusMap] = useState(new Map<string, string>());
  const { user } = useAuth();

  const {
    data: auditions = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['auditions-page'],
    queryFn: () => fetchAuditionsLightweight(50),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch application statuses for authenticated users
  useEffect(() => {
    if (user && auditions.length > 0) {
      const fetchApplicationStatuses = async () => {
        try {
          const { data, error } = await supabase
            .from('audition_applications')
            .select('audition_id, status')
            .eq('artist_id', user.id)
            .in('audition_id', auditions.map(a => a.id));

          if (!error && data) {
            const statusMap = new Map();
            data.forEach(app => {
              statusMap.set(app.audition_id, app.status);
            });
            setApplicationStatusMap(statusMap);
          }
        } catch (error) {
          console.error('Error fetching application statuses:', error);
        }
      };

      fetchApplicationStatuses();
    }
  }, [user, auditions]);

  // Filter auditions
  const filteredAuditions = auditions.filter(audition => {
    if (searchTerm && !audition.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory && audition.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const handleRetry = () => {
    refetch();
  };

  // Get unique categories from auditions
  const uniqueCategories = Array.from(new Set(auditions.map(a => a.category).filter(Boolean)));

  // Transform data for AuditionsGrid
  const transformedAuditions = filteredAuditions.map(audition => ({
    ...audition,
    requirements: '',
    gender: '',
    age_range: '',
    tags: [],
    creator_profile: {
      full_name: 'Production Company',
      profile_picture: undefined,
      company: undefined
    },
    created_at: new Date().toISOString()
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AuditionsHeader />
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuditionFilters
              uniqueCategories={uniqueCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              uniqueTags={[]}
              selectedTags={[]}
              toggleTag={() => {}}
              isLoading={isLoading}
            />
            
            <AuditionsGrid
              auditions={transformedAuditions}
              loading={isLoading}
              error={isError ? (error?.message || 'Failed to load auditions') : null}
              onClearFilters={handleClearFilters}
              onRetry={handleRetry}
              applicationStatusMap={applicationStatusMap}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Auditions;
