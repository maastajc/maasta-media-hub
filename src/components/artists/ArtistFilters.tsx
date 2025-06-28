
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  setExperienceFilter
}: ArtistFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Artists</TabsTrigger>
          <TabsTrigger value="actor">Actors</TabsTrigger>
          <TabsTrigger value="director">Directors</TabsTrigger>
          <TabsTrigger value="musician">Musicians</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Sorting and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Sort by</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="experience_desc">Most Experienced</SelectItem>
              <SelectItem value="experience_asc">Least Experienced</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Experience Level</label>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Tags filter */}
      {uniqueTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by skills:</h3>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))
            ) : (
              uniqueTags.map((tag) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistFilters;
