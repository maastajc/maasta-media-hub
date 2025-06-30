
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleArtistFiltersProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  uniqueTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  isLoading: boolean;
  sortBy: string;
  setSortBy: (sort: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  experienceFilter: string;
  setExperienceFilter: (experience: string) => void;
}

const CollapsibleArtistFilters = ({
  currentTab,
  setCurrentTab,
  uniqueTags,
  selectedTags,
  toggleTag,
  isLoading,
  sortBy,
  setSortBy,
  locationFilter,
  setLocationFilter,
  experienceFilter,
  setExperienceFilter,
}: CollapsibleArtistFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const categoryTabs = [
    { key: "all", label: "All Artists" },
    { key: "actor", label: "Actors" },
    { key: "director", label: "Directors" },
    { key: "cinematographer", label: "Cinematographers" },
    { key: "musician", label: "Musicians" },
    { key: "editor", label: "Editors" },
    { key: "producer", label: "Producers" },
    { key: "writer", label: "Writers" },
  ];

  const activeFiltersCount = [
    currentTab !== "all" ? currentTab : "",
    locationFilter,
    experienceFilter,
    ...selectedTags
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setCurrentTab("all");
    setLocationFilter('');
    setExperienceFilter('');
    selectedTags.forEach(tag => toggleTag(tag));
    setSortBy('newest');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            🎭 Filter & Sort Artists
            {activeFiltersCount > 0 && (
              <span className="bg-maasta-purple text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      <CollapsibleContent>
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={currentTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTab(tab.key)}
                disabled={isLoading}
                className="rounded-full"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Filters Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Sort by</h3>
                <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                    <SelectItem value="experience_desc">Most Experienced</SelectItem>
                    <SelectItem value="experience_asc">Least Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Location</h3>
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Experience Level</h3>
                  <Select value={experienceFilter || "all_levels"} onValueChange={(value) => setExperienceFilter(value === "all_levels" ? "" : value)} disabled={isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_levels">All levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                  <Tag className="w-4 h-4 mr-2" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      disabled={isLoading}
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                  {uniqueTags.length === 0 && !isLoading && (
                    <p className="text-sm text-gray-500">No skills available.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleArtistFilters;
