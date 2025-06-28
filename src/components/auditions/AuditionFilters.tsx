
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

interface AuditionFiltersProps {
  uniqueCategories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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
  compensationFilter: string;
  setCompensationFilter: (compensation: string) => void;
}

const AuditionFilters = ({
  uniqueCategories,
  selectedCategory,
  onCategoryChange,
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
  compensationFilter,
  setCompensationFilter,
}: AuditionFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter & Sort Auditions</CardTitle>
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
              <SelectItem value="deadline_soon">Deadline Soon</SelectItem>
              <SelectItem value="audition_date_soon">Audition Date Soon</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
              <SelectItem value="title_desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Category</h3>
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Compensation</h3>
          <Select value={compensationFilter || "all_types"} onValueChange={(value) => setCompensationFilter(value === "all_types" ? "" : value)} disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">All types</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="deferred">Deferred Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
            <Tag className="w-4 h-4 mr-2" />
            Tags
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
              <p className="text-sm text-gray-500">No tags available.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AuditionFilters;
