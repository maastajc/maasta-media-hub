

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditionsHeader from "@/components/auditions/AuditionsHeader";
import AuditionsGrid from "@/components/auditions/AuditionsGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auditions = () => {
  const [searchParams] = useSearchParams();
  const [auditions, setAuditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creators, setCreators] = useState<Record<string, string>>({});

  // Get filter values from URL params
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const experienceLevel = searchParams.get('experience') || '';
  const searchTerm = searchParams.get('search') || '';

  const fetchAuditions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching auditions with filters:', { category, location, experienceLevel, searchTerm });

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - please try again')), 10000)
      );

      let query = supabase
        .from('auditions')
        .select(`
          id,
          title,
          description,
          location,
          audition_date,
          deadline,
          status,
          creator_id,
          category,
          experience_level,
          compensation,
          cover_image_url,
          created_at
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(50); // Limit for better performance

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      if (experienceLevel) {
        query = query.eq('experience_level', experienceLevel);
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const fetchPromise = query;

      const { data, error: fetchError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (fetchError) {
        console.error('Error fetching auditions:', fetchError);
        throw new Error(`Failed to load auditions: ${fetchError.message}`);
      }

      if (!data) {
        console.log('No auditions found');
        setAuditions([]);
        return;
      }

      console.log(`Successfully fetched ${data.length} auditions`);
      setAuditions(data);

      // Fetch creator names in batch for better performance
      const creatorIds = Array.from(
        new Set(
          data
            .map((audition: any) => audition.creator_id)
            .filter((id: any): id is string => typeof id === 'string' && id.length > 0)
        )
      );
      
      if (creatorIds.length > 0) {
        const { data: creators } = await supabase
          .from('artist_details')
          .select('id, full_name')
          .in('id', creatorIds);

        if (creators) {
          const creatorsMap = creators.reduce((acc: Record<string, string>, creator: any) => {
            acc[creator.id] = creator.full_name || 'Unknown Creator';
            return acc;
          }, {});
          setCreators(creatorsMap);
        }
      }

    } catch (error: any) {
      console.error('Error in fetchAuditions:', error);
      setError(error.message || 'Failed to load auditions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditions();
  }, [category, location, experienceLevel, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Loading Auditions</h3>
              <p className="text-gray-600">Finding the best opportunities for you...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <strong>Unable to load auditions</strong>
              <p className="mt-1">{error}</p>
              <button 
                onClick={fetchAuditions}
                className="mt-3 px-4 py-2 bg-maasta-purple text-white rounded hover:bg-maasta-purple/90 transition-colors"
              >
                Try Again
              </button>
            </AlertDescription>
          </Alert>
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
          <AuditionsGrid auditions={auditions} creators={creators} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auditions;
