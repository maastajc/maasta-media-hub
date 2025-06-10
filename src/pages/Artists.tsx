
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
  const [error, setError] = useState<string | null>(null);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching artists with optimized query...");
      
      // Reduced timeout for faster feedback
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Artists loading timeout - please check your connection')), 5000)
      );

      const fetchPromise = supabase
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
          verified,
          special_skills!fk_special_skills_artist_details (skill)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: artistsData, error: artistsError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (artistsError) {
        console.error("Database error fetching artists:", artistsError);
        setError("Failed to load artists from database");
        return;
      }

      // Format the artists data efficiently with proper typing
      const formattedArtistsData = artistsData ? artistsData.map((artist: any) => ({
        ...artist,
        skills: artist.special_skills ? artist.special_skills.map((s: any) => String(s.skill || '')) : [],
      })) : [];

      console.log(`Successfully fetched ${formattedArtistsData.length} artists`);
      setArtists(formattedArtistsData || []);

      // Extract unique skills for filtering with proper typing
      const allSkills = formattedArtistsData
        .flatMap((artist: Artist) => artist.skills || [])
        .filter((skill): skill is string => typeof skill === 'string' && skill.length > 0);
      
      const uniqueSkills = Array.from(new Set(allSkills)).sort();
      setUniqueTags(uniqueSkills);
    } catch (error: any) {
      console.error("Critical error fetching artists:", error);
      setError(error.message || "Failed to load artists");
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
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
            
            <ArtistsGrid
              artists={filteredArtists}
              isLoading={loading}
              isError={!!error}
              error={error}
              onViewProfile={handleViewProfile}
              onClearFilters={handleClearFilters}
              onRetry={fetchArtists}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
