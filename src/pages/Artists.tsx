
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistFilters from "@/components/artists/ArtistFilters";
import ArtistsGrid from "@/components/artists/ArtistsGrid";
import { CacheRefreshButton } from "@/components/ui/cache-refresh-button";
import { useArtists } from "@/hooks/useArtists";
import { toast } from "sonner";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
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
    staleTime: 0 // Always fetch fresh data
  });

  // Extract unique tags from artists data
  const uniqueTags = Array.from(
    new Set(
      artists
        .flatMap(artist => artist.skills || [])
        .filter(skill => skill && skill.trim().length > 0)
    )
  ).sort();

  // Filter and sort artists
  const filteredAndSortedArtists = (() => {
    let filtered = filterArtists(artists, {
      search: searchTerm,
      category: currentTab === "all" ? undefined : currentTab,
      experienceLevel: experienceFilter || undefined,
      location: locationFilter || undefined
    }).filter(artist => {
      // Additional tag filtering
      if (selectedTags.length === 0) return true;
      return selectedTags.some(tag => artist.skills?.includes(tag));
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.full_name || "").localeCompare(b.full_name || "");
        case "name_desc":
          return (b.full_name || "").localeCompare(a.full_name || "");
        case "experience_desc":
          return (b.years_of_experience || 0) - (a.years_of_experience || 0);
        case "experience_asc":
          return (a.years_of_experience || 0) - (b.years_of_experience || 0);
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  })();

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
    setSortBy("newest");
    setLocationFilter("");
    setExperienceFilter("");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing artists...");
  };

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Artists Directory</h2>
              <CacheRefreshButton onRefresh={handleRefresh} />
            </div>
            
            <ArtistFilters
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              uniqueTags={uniqueTags}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              isLoading={isLoading}
              sortBy={sortBy}
              setSortBy={setSortBy}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              experienceFilter={experienceFilter}
              setExperienceFilter={setExperienceFilter}
            />
            
            <ArtistsGrid
              artists={filteredAndSortedArtists}
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
