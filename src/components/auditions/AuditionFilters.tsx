
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

interface AuditionFiltersProps {
  uniqueCategories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  uniqueTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  isLoading: boolean;
}

const AuditionFilters = ({
  uniqueCategories,
  selectedCategory,
  onCategoryChange,
  uniqueTags,
  selectedTags,
  toggleTag,
  isLoading,
}: AuditionFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Auditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
