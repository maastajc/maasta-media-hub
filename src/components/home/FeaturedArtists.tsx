import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

const FeaturedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching featured artists...');
      
      const { data: artistsData, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          bio,
          profile_picture_url,
          city,
          state,
          country,
          category,
          experience_level,
          verified,
          special_skills(skill)
        `)
        .eq('status', 'active')
        .not('profile_picture_url', 'is', null)
        .limit(8);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!artistsData || artistsData.length === 0) {
        console.log('No featured artists found');
        setArtists([]);
        return;
      }

      console.log(`Successfully fetched ${artistsData.length} featured artists`);
      
      const transformedArtists = artistsData.map((artist: any) => {
        const skills = artist.special_skills?.map((s: any) => s.skill) || [];
        
        return {
          id: artist.id,
          full_name: artist.full_name || "Unknown Artist",
          email: artist.email,
          category: artist.category,
          experience_level: artist.experience_level || 'beginner',
          bio: artist.bio,
          profile_picture_url: artist.profile_picture_url,
          city: artist.city,
          state: artist.state,
          country: artist.country,
          verified: artist.verified || false,
          skills: skills,
          phone_number: null,
          date_of_birth: null,
          gender: null,
          willing_to_relocate: false,
          work_preference: "any",
          years_of_experience: 0,
          association_membership: null,
          personal_website: null,
          instagram: null,
          linkedin: null,
          youtube_vimeo: null,
          role: 'artist',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          projects: [],
          education_training: [],
          media_assets: [],
          language_skills: [],
          tools_software: [],
          special_skills: []
        } as Artist;
      });

      setArtists(transformedArtists);
    } catch (error: any) {
      console.error('Failed to load featured artists:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedArtists();
  }, []);

  const LoadingSkeleton = () => (
    <div className="flex gap-6">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-64">
          <Card className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <div className="flex flex-wrap gap-1 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Artists</h2>
            <Link to="/artists">
              <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
                View all artists
              </Button>
            </Link>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Artists</h2>
            <Link to="/artists">
              <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
                View all artists
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Unable to load featured artists</h3>
            <p className="text-gray-500 mb-4">Please check your connection and try again</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchFeaturedArtists} variant="outline">
                Try Again
              </Button>
              <Link to="/artists">
                <Button variant="outline" className="border-maasta-purple text-maasta-purple hover:bg-maasta-purple/10">
                  Browse All Artists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Artists</h2>
          <Link to="/artists">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all artists
            </Button>
          </Link>
        </div>
        
        {artists.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {artists.map((artist) => (
                  <CarouselItem key={artist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                    <Card className="overflow-hidden card-hover h-full">
                      <div className="relative h-64">
                        <img
                          src={artist.profile_picture_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"}
                          alt={artist.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop";
                          }}
                        />
                        {artist.verified && (
                          <div className="absolute top-2 right-2 bg-maasta-purple text-white text-xs p-1 px-2 rounded-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg truncate">{artist.full_name}</h3>
                        <p className="text-gray-500 text-sm mb-3 capitalize">
                          {artist.category} • {artist.experience_level}
                        </p>
                        {artist.city && artist.state && (
                          <p className="text-gray-400 text-xs mb-3">
                            {artist.city}, {artist.state}
                          </p>
                        )}
                        <div className="flex flex-wrap mb-4">
                          {artist.skills?.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="tag mr-1 mb-1">
                              {skill}
                            </span>
                          ))}
                          {artist.skills && artist.skills.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{artist.skills.length - 2} more
                            </span>
                          )}
                        </div>
                        <Link to={`/artists/${artist.id}`}>
                          <Button variant="outline" className="w-full border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5">
                            View Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
              <CarouselNext className="hidden md:flex -right-12 bg-white shadow-lg border-2 hover:bg-gray-50" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No featured artists available</h3>
            <p className="text-gray-500 mb-4">Check back soon for featured artist profiles</p>
            <Link to="/artists">
              <Button variant="outline" className="border-maasta-purple text-maasta-purple hover:bg-maasta-purple/10">
                Browse All Artists
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtists;
