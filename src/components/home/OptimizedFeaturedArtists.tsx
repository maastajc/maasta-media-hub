
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptimizedArtists } from "@/hooks/useOptimizedArtists";

const OptimizedFeaturedArtists = () => {
  const { data: artists = [], isLoading } = useOptimizedArtists();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Artists</h2>
          <p className="text-lg text-gray-600 mb-8">Discover talented professionals from our creative community</p>
          <Link to="/artists">
            <Button variant="outline" className="text-maasta-orange border-maasta-orange hover:bg-maasta-orange hover:text-white transition-all duration-300">
              View all artists →
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : artists.length > 0 ? (
            artists.slice(0, 3).map((artist) => (
              <Card key={artist.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    {artist.profile_picture_url ? (
                      <img
                        src={artist.profile_picture_url}
                        alt={artist.full_name}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-maasta-orange to-maasta-purple flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                        <span className="text-white text-2xl font-bold">
                          {artist.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {artist.verified && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 group-hover:text-maasta-orange transition-colors">
                    {artist.full_name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {artist.category && (
                      <Badge variant="secondary" className="text-xs">
                        {artist.category}
                      </Badge>
                    )}
                    {artist.experience_level && (
                      <Badge variant="outline" className="text-xs">
                        {artist.experience_level}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {artist.bio || "Professional artist with extensive experience in the industry."}
                  </p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    📍 {artist.city && artist.state 
                      ? `${artist.city}, ${artist.state}` 
                      : artist.country || "Location not specified"}
                  </div>
                  
                  <Link to={`/artists/${artist.id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-maasta-orange to-maasta-purple hover:from-maasta-orange/90 hover:to-maasta-purple/90">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No artists available</h3>
              <p className="text-gray-500 mb-6">Check back soon to discover new talent</p>
              <Link to="/artists">
                <Button className="bg-gradient-to-r from-maasta-orange to-maasta-purple hover:from-maasta-orange/90 hover:to-maasta-purple/90 text-white px-8 py-3">
                  Browse Artists
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OptimizedFeaturedArtists;
