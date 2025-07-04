
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { ArtistCard } from "../artists/ArtistCard";
import ArtistCardSkeleton from "../artists/ArtistCardSkeleton";
import { useArtists } from "@/hooks/useArtists";
import Autoplay from "embla-carousel-autoplay";

const FeaturedArtists = () => {
  const { artists, isLoading } = useArtists();
  const [api, setApi] = useState<CarouselApi>();

  // Get featured artists (first 6)
  const featuredArtists = artists.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tamil Artists</h2>
          <p className="text-lg text-gray-600 mb-8">Discover talented artists ready for your next project</p>
          <Link to="/artists">
            <Button variant="outline" className="text-maasta-orange border-maasta-orange hover:bg-maasta-orange hover:text-white transition-all duration-300">
              Browse all artists →
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <ArtistCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredArtists.length > 0 ? (
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
                {featuredArtists.map((artist) => (
                  <CarouselItem key={artist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <ArtistCard 
                      artist={artist}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
              <CarouselNext className="hidden md:flex -right-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No featured artists yet</h3>
            <p className="text-gray-500 mb-6">Check back soon to discover amazing talent</p>
            <Link to="/artists">
              <Button className="bg-gradient-to-r from-maasta-orange to-maasta-purple hover:from-maasta-orange/90 hover:to-maasta-purple/90 text-white px-8 py-3">
                Explore Artists
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtists;
