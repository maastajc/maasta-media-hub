import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import ArtistCard from "./ArtistCard";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Artist } from "@/types/artist";

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
  <Alert className="border-red-200 bg-red-50">
    <AlertCircle className="h-4 w-4 text-red-600" />
    <AlertDescription>
      <div className="flex flex-col gap-3">
        <p className="text-red-800">
          {error?.message || "Failed to load artists. This might be due to server issues or network problems."}
        </p>
        <div className="flex gap-2">
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry}
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </AlertDescription>
  </Alert>
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

  // Show artists grid with error boundary
  return (
    <ErrorBoundary fallback={<ErrorState error={{ message: "Error displaying artists" }} onRetry={onRetry} />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {artists.length} artist{artists.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map((artist) => {
            // Validate artist data before rendering
            if (!artist?.id || !artist?.full_name) {
              console.warn("Invalid artist data:", artist);
              return null;
            }

            return (
              <ErrorBoundary 
                key={artist.id}
                fallback={
                  <Card className="p-4 text-center">
                    <p className="text-gray-500">Error loading artist</p>
                  </Card>
                }
              >
                <ArtistCard
                  artist={artist}
                  onViewProfile={onViewProfile}
                />
              </ErrorBoundary>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ArtistsGrid;
