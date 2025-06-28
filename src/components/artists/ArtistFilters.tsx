
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag } from "lucide-react"

interface ArtistFiltersProps {
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

const ArtistFilters = ({
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
}: ArtistFiltersProps) => {
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

  return (
    <div className="mb-8 space-y-6">
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
        <CardHeader>
          <CardTitle>Filter & Sort Artists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
  )
}

export default ArtistFilters;
