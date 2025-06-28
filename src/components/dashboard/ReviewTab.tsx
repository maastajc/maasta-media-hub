
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { Eye, Users, Calendar } from "lucide-react";

interface ReviewTabProps {
  isLoading: boolean;
  userAuditions: any[];
  formatDate: (dateString: string) => string;
}

export const ReviewTab = ({ isLoading, userAuditions, formatDate }: ReviewTabProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const auditionsWithApplications = userAuditions.filter(audition => audition.id);

  if (auditionsWithApplications.length === 0) {
    return (
      <EmptyState
        title="No auditions to review"
        buttonText="Create Audition"
        buttonAction={() => navigate("/create-audition")}
        buttonClassName="bg-maasta-orange hover:bg-maasta-orange/90"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Review applications for your auditions
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auditionsWithApplications.map((audition) => (
          <Card key={audition.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{audition.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  audition.status === 'open' ? 'bg-green-100 text-green-800' :
                  audition.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {audition.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created: {formatDate(audition.created_at)}</span>
                </div>
                {audition.location && (
                  <div className="flex items-center">
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{audition.location}</span>
                  </div>
                )}
                {audition.deadline && (
                  <div className="flex items-center">
                    <span className="font-medium">Deadline:</span>
                    <span className="ml-1">{formatDate(audition.deadline)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate(`/applications/${audition.id}`)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
                <Button 
                  onClick={() => navigate(`/review/${audition.id}`)}
                  size="sm" 
                  className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
