
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, User, AlertCircle, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuditionData {
  id: string;
  title: string;
  description: string;
  location: string;
  audition_date: string;
  deadline: string;
  compensation: string;
  requirements: string;
  status: string;
  category: string;
  experience_level: string;
  gender: string;
  age_range: string;
  cover_image_url: string;
  tags: string[];
  creator_profile: {
    full_name: string;
  };
  created_at: string;
}

interface AuditionsGridProps {
  auditions: AuditionData[];
  loading: boolean;
  error: string | null;
  onClearFilters: () => void;
  onRetry: () => void;
}

const AuditionsGrid = ({ auditions, loading, error, onClearFilters, onRetry }: AuditionsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading auditions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="flex flex-col gap-3">
            <p className="text-red-800">Unable to load auditions: {error}</p>
            <div className="flex gap-2">
              <Button 
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (auditions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No auditions available</p>
        <p className="text-gray-500 mt-2">Check back later for new opportunities</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {auditions.length} audition{auditions.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditions.map((audition) => (
          <Card key={audition.id} className="hover:shadow-lg transition-shadow">
            {audition.cover_image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  src={audition.cover_image_url} 
                  alt={audition.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide broken images
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{audition.title}</CardTitle>
                {audition.category && (
                  <Badge variant="secondary" className="capitalize">
                    {audition.category}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {audition.creator_profile?.full_name || 'Unknown Creator'}
                </div>
                
                {audition.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {audition.location}
                  </div>
                )}
                
                {audition.deadline && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Deadline: {new Date(audition.deadline).toLocaleDateString()}
                  </div>
                )}
                
                {audition.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {audition.description}
                  </p>
                )}
                
                {audition.tags && audition.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {audition.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {audition.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{audition.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <Button className="w-full mt-4">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuditionsGrid;
