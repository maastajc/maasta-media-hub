
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import ArtistsGrid from "@/components/artists/ArtistsGrid";
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
  experience_level?: string;
  years_of_experience?: number;
}

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchArtists = async () => {
    setLoading(true);
    try {
      console.log("Fetching artists from unified artist_details table...");
      
      // Fetch artists directly from artist_details table with skills
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
          category,
          experience_level,
          years_of_experience,
          special_skills!fk_special_skills_artist_details (skill)
        `);

      if (artistsError) {
        console.error("Error fetching artists:", artistsError);
        toast.error("Failed to load artists");
        return;
      }

      // Format the artists data
      const formattedArtistsData = artistsData ? artistsData.map(artist => ({
        ...artist,
        skills: artist.special_skills ? artist.special_skills.map((s: any) => s.skill) : [],
        verified: Math.random() > 0.5 // Random verification status for demo
      })) : [];

      console.log("Formatted artists data:", formattedArtistsData);
      setArtists(formattedArtistsData || []);

      // Extract unique skills for filtering
      const allSkills = formattedArtistsData.flatMap(artist => artist.skills || []);
      const uniqueSkills = Array.from(new Set(allSkills)).sort();
      setUniqueTags(uniqueSkills);
    } catch (error: any) {
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setCurrentTab("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ArtistsHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={fetchArtists}
        />
        
        {/* Artists Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ArtistFilters
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              uniqueTags={uniqueTags}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              isLoading={loading}
            />
            
            {/* Results display */}
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredArtists.length} artists
              </p>
              
              <ArtistsGrid
                artists={filteredArtists}
                isLoading={loading}
                onViewProfile={handleViewProfile}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
