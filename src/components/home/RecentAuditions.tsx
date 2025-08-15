
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import OptimizedAuditionCard from "./OptimizedAuditionCard";
import AuditionCardSkeleton from "./AuditionCardSkeleton";
import { fetchRecentAuditions } from "@/services/auditionService";
import { Audition } from "@/types/audition";
import Autoplay from "embla-carousel-autoplay";

const RecentAuditions = () => {
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const navigate = useNavigate();

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
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Auditions
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Latest casting calls and opportunities for media professionals
          </p>
          <Button 
            onClick={() => navigate('/auditions')}
            variant="outline"
            size="lg"
          >
            View All Auditions
          </Button>
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
              setApi={setApi}
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: true,
                })
              ]}
              opts={{
                align: "start",
                loop: true,
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
          <div className="text-center py-16 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-foreground">No auditions available</h3>
            <p className="text-muted-foreground mb-6">Check back soon for new opportunities</p>
            <Button 
              onClick={() => navigate('/auditions')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-3"
            >
              View Auditions
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentAuditions;
