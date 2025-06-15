
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import OptimizedAuditionCard from "@/components/home/OptimizedAuditionCard";

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
  applicationStatusMap: Map<string, string>;
}

const AuditionsGrid = ({ auditions, loading, error, onClearFilters, onRetry, applicationStatusMap }: AuditionsGridProps) => {
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

  if (auditions.length === 0 && !loading && !error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No auditions available</p>
        <p className="text-gray-500 mt-2">Check back later for new opportunities, or try different filters.</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
        {auditions.map((audition) => (
          <OptimizedAuditionCard
            key={audition.id}
            audition={{
              ...audition,
              company: audition.creator_profile?.full_name || 'Unknown Creator',
              applicationStatus: applicationStatusMap.get(audition.id),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuditionsGrid;
