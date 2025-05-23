
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuditionCard from "./AuditionCard";
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
              <AuditionCard key={audition.id} audition={audition} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-lg font-medium mb-1">No auditions available</h3>
              <p className="text-gray-500 mb-4">Check back soon for new opportunities</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentAuditions;
