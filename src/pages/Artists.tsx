
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import ArtistsGrid from "@/components/artists/ArtistsGrid";
import { useOptimizedArtists } from "@/hooks/useOptimizedArtists";
import { toast } from "sonner";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const navigate = useNavigate();

  const {
    data: artists = [],
    isLoading,
    isError,
    error,
    refetch
  } = useOptimizedArtists();

  // Filter artists based on search term and current tab
  const filteredArtists = artists.filter(artist => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = artist.full_name?.toLowerCase().includes(searchLower);
      const matchesBio = artist.bio?.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesBio) return false;
    }

    // Category filter
    if (currentTab !== "all" && artist.category !== currentTab) {
      return false;
    }

    return true;
  });

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
              uniqueTags={[]}
              selectedTags={selectedTags}
              toggleTag={() => {}}
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
