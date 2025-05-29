
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtistFiltersProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  uniqueTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  isLoading: boolean;
}

const ArtistFilters = ({ 
  currentTab, 
  setCurrentTab, 
  uniqueTags, 
  selectedTags, 
  toggleTag, 
  isLoading 
}: ArtistFiltersProps) => {
  return (
    <>
      {/* Category tabs */}
      <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Artists</TabsTrigger>
          <TabsTrigger value="actor">Actors</TabsTrigger>
          <TabsTrigger value="director">Directors</TabsTrigger>
          <TabsTrigger value="musician">Musicians</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Tags filter */}
      {uniqueTags.length > 0 && (
        <div className="mb-8">
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
    </>
  );
};

export default ArtistFilters;
