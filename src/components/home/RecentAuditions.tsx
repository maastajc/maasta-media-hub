
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OptimizedAuditionCard from "./OptimizedAuditionCard";
import AuditionCardSkeleton from "./AuditionCardSkeleton";
import { fetchRecentAuditions } from "@/services/auditionService";
import { Audition } from "@/types/audition";

const RecentAuditions = () => {
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentAuditions = async () => {
      setLoading(true);
      try {
        const auditionData = await fetchRecentAuditions();
        // Map the data to match our Audition interface
        const mappedAuditions = auditionData.slice(0, 3).map((audition: any) => ({
          id: audition.id,
          title: audition.title,
          description: audition.description || audition.requirements || '',
          location: audition.location,
          audition_date: audition.audition_date,
          deadline: audition.deadline,
          requirements: audition.requirements,
          tags: audition.tags,
          urgent: audition.urgent || false,
          cover_image_url: audition.cover_image_url,
          company: audition.profiles?.full_name || '',
          category: audition.category,
          age_range: audition.age_range,
          gender: audition.gender,
          experience_level: audition.experience_level,
          compensation: audition.compensation,
          status: audition.status || 'open'
        }));
        setAuditions(mappedAuditions);
      } catch (error) {
        console.error("Failed to fetch auditions:", error);
      } finally {
        setLoading(false);
      }
    };

    getRecentAuditions();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Audition Calls</h2>
          <Link to="/auditions">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all auditions
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading states
            Array(3).fill(0).map((_, i) => (
              <AuditionCardSkeleton key={i} />
            ))
          ) : auditions.length > 0 ? (
            auditions.map((audition) => (
              <OptimizedAuditionCard key={audition.id} audition={audition} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-lg font-medium mb-1">No auditions available</h3>
              <p className="text-gray-500 mb-4">Check back soon for new opportunities</p>
              <Link to="/auditions">
                <Button className="bg-maasta-purple hover:bg-maasta-purple/90">
                  Post an Audition
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentAuditions;
