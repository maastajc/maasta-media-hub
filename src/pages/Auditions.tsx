
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
  const [searchParams] = useSearchParams();
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auditions fetch timeout')), 10000)
      );

      const fetchPromise = supabase
        .from('auditions')
        .select(`
          *,
          creator_profile:artist_details!auditions_creator_id_fkey(full_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Error fetching auditions:', error);
        // Use fallback data if database query fails
        setAuditions([]);
        return;
      }

      // Transform data to match expected format
      const transformedAuditions = (data || []).map((audition: any) => ({
        ...audition,
        creator_profile: {
          full_name: audition.creator_profile?.full_name || 'Unknown Creator'
        }
      }));

      setAuditions(transformedAuditions);
    } catch (error: any) {
      console.error('Error in fetchAuditions:', error);
      setError(error.message);
      // Set empty array as fallback
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
    return true;
  });

  if (loading) {
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
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ArtistFilters />
            </aside>
            
            <div className="flex-1">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">Error loading auditions: {error}</p>
                  <button 
                    onClick={fetchAuditions}
                    className="mt-2 text-red-600 underline hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              )}
              
              <AuditionsGrid 
                auditions={filteredAuditions} 
                loading={loading}
                error={error}
              />
              
              {!loading && !error && filteredAuditions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No auditions found matching your criteria</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
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
