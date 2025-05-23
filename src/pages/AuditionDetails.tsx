import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DEFAULT_COVER } from '@/utils/auditionHelpers';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AuditionDetailsData {
  audition_date: string;
  compensation: string;
  created_at: string;
  creator_id: string;
  deadline: string;
  description: string;
  id: string;
  location: string;
  project_details: string;
  requirements: string;
  status: string;
  title: string;
  updated_at: string;
  creator: {
    full_name: string;
    profile_picture_url?: string;
  };
  // Optional fields that might not exist in database yet
  cover_image_url?: string | null;
  tags?: string[] | null;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
}

const AuditionDetails = () => {
  const { auditionId } = useParams<{ auditionId: string }>();
  const [audition, setAudition] = useState<AuditionDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditionDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('auditions')
          .select(`
            *,
            creator: creator_id (
              full_name,
              profile_picture_url
            )
          `)
          .eq('id', auditionId);

        if (error) {
          console.error("Error fetching audition details:", error);
          toast.error("Failed to load audition details");
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const auditionData = data[0] as AuditionDetailsData;
          setAudition({
            ...auditionData,
            cover_image_url: auditionData.cover_image_url || null,
            tags: auditionData.tags || [],
            category: auditionData.category || null,
            age_range: auditionData.age_range || null,
            gender: auditionData.gender || null,
            experience_level: auditionData.experience_level || null
          });
        } else {
          toast.error("Audition not found");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Failed to load audition details");
      } finally {
        setLoading(false);
      }
    };

    if (auditionId) {
      fetchAuditionDetails();
    }

    // Cleanup function (if needed)
    return () => {
      // Any cleanup logic here
    };
  }, [auditionId]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!audition) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-1">Audition not found</h3>
            <p className="text-gray-500 mb-4">Please check the audition ID or try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/auditions">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              Back to Auditions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <img
              src={audition.cover_image_url || DEFAULT_COVER}
              alt={audition.title}
              className="w-full h-64 object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = DEFAULT_COVER;
              }}
            />
          </div>

          {/* Details Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{audition.title}</h2>
            <p className="text-maasta-purple font-medium text-sm mb-4">
              Posted by: {audition.creator?.full_name || 'Unknown Creator'}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {audition.location}
            </div>

            <div className="mb-4">
              <span className="font-medium">Deadline:</span> {audition.deadline ? new Date(audition.deadline).toLocaleDateString() : 'Open until filled'}
            </div>

            {audition.tags && audition.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {audition.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {audition.category && (
              <div className="mb-4">
                <span className="font-medium">Category:</span> {audition.category}
              </div>
            )}

            {audition.age_range && (
              <div className="mb-4">
                <span className="font-medium">Age Range:</span> {audition.age_range}
              </div>
            )}

            {audition.gender && (
              <div className="mb-4">
                <span className="font-medium">Gender:</span> {audition.gender}
              </div>
            )}

            {audition.experience_level && (
              <div className="mb-4">
                <span className="font-medium">Experience Level:</span> {audition.experience_level}
              </div>
            )}
          </div>
        </div>

        {/* Full Description Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed">{audition.description}</p>
        </div>

        {/* Requirements Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Requirements</h3>
          <p className="text-gray-700 leading-relaxed">{audition.requirements}</p>
        </div>

        {/* Project Details Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Project Details</h3>
          <p className="text-gray-700 leading-relaxed">{audition.project_details}</p>
        </div>

        {/* Compensation Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Compensation</h3>
          <p className="text-gray-700 leading-relaxed">{audition.compensation}</p>
        </div>

        {/* Audition Date Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Audition Date</h3>
          <p className="text-gray-700 leading-relaxed">{audition.audition_date ? new Date(audition.audition_date).toLocaleDateString() : 'To be announced'}</p>
        </div>
      </div>
    </section>
  );
};

export default AuditionDetails;
