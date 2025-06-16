
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import ArtistsGrid from "@/components/artists/ArtistsGrid";
import { useArtists } from "@/hooks/useArtists";
import { toast } from "sonner";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const navigate = useNavigate();

  const {
    artists,
    isLoading,
    isError,
    error,
    refetch,
    filterArtists
  } = useArtists({
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Extract unique tags from artists data
  const uniqueTags = Array.from(
    new Set(
      artists
        .flatMap(artist => artist.skills || [])
        .filter(skill => skill && skill.trim().length > 0)
    )
  ).sort();

  // Filter artists based on search term, selected tags, and current tab
  const filteredArtists = filterArtists(artists, {
    search: searchTerm,
    category: currentTab === "all" ? undefined : currentTab,
    experienceLevel: undefined,
    location: undefined
  }).filter(artist => {
    // Additional tag filtering
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => artist.skills?.includes(tag));
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleViewProfile = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setCurrentTab("all");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing artists...");
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to load artists. Please try again.");
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ArtistsHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={handleRefresh}
        />
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ArtistFilters
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              uniqueTags={uniqueTags}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              isLoading={isLoading}
            />
            
            <ArtistsGrid
              artists={filteredArtists}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onViewProfile={handleViewProfile}
              onClearFilters={handleClearFilters}
              onRetry={handleRefresh}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
