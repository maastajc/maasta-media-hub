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
        setAuditions(auditionData);
      } catch (error) {
        console.error("Failed to fetch auditions:", error);
      } finally {
        setLoading(false);
      }
    };

    getRecentAuditions();
  }, []);

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

export default RecentAuditions;
