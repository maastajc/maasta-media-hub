
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OptimizedAuditionCard from "./OptimizedAuditionCard";
import AuditionCardSkeleton from "./AuditionCardSkeleton";
import { fetchAuditionsLightweight } from "@/services/optimizedAuditionService";

const OptimizedRecentAuditions = () => {
  const { data: auditions = [], isLoading } = useQuery({
    queryKey: ['recent-auditions'],
    queryFn: () => fetchAuditionsLightweight(6),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Audition Opportunities</h2>
          <p className="text-lg text-gray-600 mb-8">Discover genuine casting calls from verified production houses</p>
          <Link to="/auditions">
            <Button variant="outline" className="text-maasta-purple border-maasta-purple hover:bg-maasta-purple hover:text-white transition-all duration-300">
              View all auditions →
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <AuditionCardSkeleton key={i} />
            ))
          ) : auditions.length > 0 ? (
            auditions.map((audition) => (
              <OptimizedAuditionCard 
                key={audition.id} 
                audition={{
                  ...audition,
                  requirements: '',
                  age_range: '',
                  gender: '',
                  tags: [],
                  company: 'Production Company'
                }} 
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-16 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No auditions available</h3>
              <p className="text-gray-500 mb-6">Check back soon for new opportunities</p>
              <Link to="/auditions">
                <Button className="bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white px-8 py-3">
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

export default OptimizedRecentAuditions;
