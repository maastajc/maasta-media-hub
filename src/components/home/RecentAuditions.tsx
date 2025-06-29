
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
        // Sort by newest first (created_at desc)
        const sortedAuditions = auditionData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAuditions(sortedAuditions);
      } catch (error) {
        console.error("Failed to fetch auditions:", error);
      } finally {
        setLoading(false);
      }
    };

    getRecentAuditions();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <AuditionCardSkeleton key={i} />
            ))}
          </div>
        ) : auditions.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {auditions.map((audition) => (
                  <CarouselItem key={audition.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <OptimizedAuditionCard audition={audition} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
              <CarouselNext className="hidden md:flex -right-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
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
    </section>
  );
};

export default RecentAuditions;
