
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ArtistCard from "./ArtistCard";

interface Artist {
  id: string;
  full_name: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  country?: string;
  skills?: string[];
  verified?: boolean;
}

interface ArtistsGridProps {
  artists: Artist[];
  isLoading: boolean;
  onViewProfile: (artistId: string) => void;
  onClearFilters: () => void;
}

const ArtistsGrid = ({ artists, isLoading, onViewProfile, onClearFilters }: ArtistsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No artists found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default ArtistsGrid;
