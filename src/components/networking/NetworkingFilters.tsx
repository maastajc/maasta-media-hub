
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface NetworkingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  experienceFilter: string;
  setExperienceFilter: (experience: string) => void;
}

const NetworkingFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  experienceFilter,
  setExperienceFilter
}: NetworkingFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = categoryFilter !== "all" || locationFilter !== "" || experienceFilter !== "all";

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 w-full"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-maasta-purple text-white text-xs px-2 py-1 rounded-full ml-2">
                {[categoryFilter !== "all", locationFilter !== "", experienceFilter !== "all"].filter(Boolean).length}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </Button>
        </div>

        {/* Collapsible Filters */}
        {isExpanded && (
          <div className="space-y-4 animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="actor">Actor</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="musician">Musician</SelectItem>
                    <SelectItem value="producer">Producer</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="cinematographer">Cinematographer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
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
                <label className="text-sm font-medium mb-2 block">Experience</label>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="fresher">Fresher</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="veteran">Veteran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter("all");
                    setLocationFilter("");
                    setExperienceFilter("all");
                  }}
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkingFilters;
