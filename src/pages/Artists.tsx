import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Artist {
  id: string;
  full_name: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  country?: string;
  instagram?: string;
  linkedin?: string;
  skills?: string[];
  category?: string;
  verified?: boolean;
}

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchArtists = async () => {
    setLoading(true);
    try {
      console.log("Fetching artists from database...");
      
      // Fetch artists directly from artist_details table
      const { data: artistsData, error: artistsError } = await supabase
        .from('artist_details')
        .select(`
          id,
          full_name,
          bio,
          profile_picture_url,
          city,
          state,
          country,
          instagram,
          linkedin,
          special_skills (skill),
          category,
          verified: role
        `)
        .eq('role', 'artist');

      if (artistsError) {
        console.error("Error fetching artists:", artistsError);
        toast.error("Failed to load artists");
        return;
      }

      // Map the skills from the nested array to a simple array of strings
      const formattedArtistsData = artistsData ? artistsData.map(artist => ({
        ...artist,
        skills: artist.special_skills ? artist.special_skills.map(s => s.skill) : [],
        verified: Math.random() > 0.5 // setting random verification status for demo
      })) : [];

      console.log("Formatted artists data:", formattedArtistsData);
      setArtists(formattedArtistsData || []);

      // Extract unique skills for filtering
      const allSkills = formattedArtistsData.flatMap(artist => artist.skills || []);
      const uniqueSkills = Array.from(new Set(allSkills)).sort();
      setUniqueTags(uniqueSkills);
    } catch (error) {
      console.error("Error fetching artists:", error);
      toast.error("Failed to load artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Refresh artists when we come back to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchArtists();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  
  // Filter artists based on search term, selected tags, and current tab
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = 
      artist.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some((tag) => artist.skills?.includes(tag));
    
    const matchesCategory = 
      currentTab === "all" || artist.category === currentTab;
    
    return matchesSearch && matchesTags && matchesCategory;
  });
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleViewProfile = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  const handleJoinAsArtist = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/sign-up");
    }
  };

  const getLocationString = (artist: Artist) => {
    const parts = [artist.city, artist.state, artist.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-maasta-purple/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Artists</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Connect with talented professionals from across the media industry
                </p>
              </div>
              <Button 
                className="bg-maasta-orange hover:bg-maasta-orange/90"
                onClick={handleJoinAsArtist}
              >
                Join as an Artist
              </Button>
            </div>
            
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="hidden md:block">
                <Button 
                  className="bg-maasta-orange hover:bg-maasta-orange/90"
                  onClick={fetchArtists}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Artists Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Artists</TabsTrigger>
                <TabsTrigger value="performer">Performers</TabsTrigger>
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Tags filter */}
            {uniqueTags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-2">Filter by skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={selectedTags.includes(tag) 
                        ? "bg-maasta-purple hover:bg-maasta-purple/90" 
                        : "hover:bg-maasta-purple/10 hover:text-maasta-purple"
                      }
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Results display */}
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(8).fill(0).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-3" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredArtists.length} artists
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredArtists.map((artist) => (
                      <Card key={artist.id} className="overflow-hidden card-hover">
                        <div className="relative h-64">
                          <img
                            src={artist.profile_picture_url || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3`}
                            alt={artist.full_name}
                            className="w-full h-full object-cover"
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
                          <h3 className="font-semibold text-lg">{artist.full_name}</h3>
                          <p className="text-gray-500 text-sm mb-3">{getLocationString(artist)}</p>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{artist.bio}</p>
                          <div className="flex flex-wrap mb-3">
                            {artist.skills?.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="tag">
                                {skill}
                              </span>
                            ))}
                            {(artist.skills?.length || 0) > 3 && (
                              <span className="tag">+{(artist.skills?.length || 0) - 3} more</span>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5"
                            onClick={() => handleViewProfile(artist.id)}
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredArtists.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium mb-2">No artists found</h3>
                      <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
