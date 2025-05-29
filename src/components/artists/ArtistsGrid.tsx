
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
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
  isError?: boolean;
  error?: any;
  onViewProfile: (artistId: string) => void;
  onClearFilters: () => void;
  onRetry?: () => void;
}

const LoadingSkeleton = () => (
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

const ErrorState = ({ error, onRetry }: { error?: any; onRetry?: () => void }) => (
  <div className="text-center py-12">
    <Alert className="max-w-md mx-auto mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error?.message || "Failed to load artists. Please try again."}
      </AlertDescription>
    </Alert>
    
    {onRetry && (
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    )}
  </div>
);

const EmptyState = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium mb-2">No artists found</h3>
    <p className="text-gray-500 mb-4">
      Try adjusting your search or filters to find more artists
    </p>
    <Button variant="outline" onClick={onClearFilters}>
      Clear filters
    </Button>
  </div>
);

const ArtistsGrid = ({ 
  artists, 
  isLoading, 
  isError = false,
  error,
  onViewProfile, 
  onClearFilters,
  onRetry
}: ArtistsGridProps) => {
  // Show loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Show empty state
  if (!artists || artists.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  // Show artists grid
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Showing {artists.length} artist{artists.length !== 1 ? 's' : ''}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => {
          // Validate artist data before rendering
          if (!artist?.id || !artist?.full_name) {
            console.warn("Invalid artist data:", artist);
            return null;
          }

          return (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onViewProfile={onViewProfile}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ArtistsGrid;
