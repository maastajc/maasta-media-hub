
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  ExternalLink,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface AuditionCardProps {
  audition: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    location?: string;
    audition_date?: string;
    deadline?: string;
    compensation?: string;
    experience_level?: string;
    age_range?: string;
    gender?: string;
    created_at?: string;
    creator_id?: string;
    status?: string;
  };
}

export const AuditionCard = ({ audition }: AuditionCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/auditions/${audition.id}`);
  };

  const isDeadlineSoon = () => {
    if (!audition.deadline) return false;
    const deadline = new Date(audition.deadline);
    const now = new Date();
    const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3 && diffInDays >= 0;
  };

  const isExpired = () => {
    if (!audition.deadline) return false;
    const deadline = new Date(audition.deadline);
    const now = new Date();
    return deadline < now;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-maasta-orange/30 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                {audition.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {audition.category && (
                  <Badge 
                    variant="secondary" 
                    className="bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20"
                  >
                    {audition.category.charAt(0).toUpperCase() + audition.category.slice(1)}
                  </Badge>
                )}
                
                {audition.experience_level && (
                  <Badge variant="outline" className="text-xs">
                    {audition.experience_level.charAt(0).toUpperCase() + audition.experience_level.slice(1)}
                  </Badge>
                )}
                
                {isDeadlineSoon() && (
                  <Badge variant="destructive" className="text-xs bg-red-500">
                    Deadline Soon
                  </Badge>
                )}
                
                {isExpired() && (
                  <Badge variant="secondary" className="text-xs bg-gray-400 text-white">
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {audition.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {audition.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2 mb-4">
            {audition.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-maasta-orange flex-shrink-0" />
                <span className="truncate">{audition.location}</span>
              </div>
            )}

            {audition.audition_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-maasta-orange flex-shrink-0" />
                <span>{new Date(audition.audition_date).toLocaleDateString()}</span>
              </div>
            )}

            {audition.deadline && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-maasta-orange flex-shrink-0" />
                <span>
                  Apply by {formatDistanceToNow(new Date(audition.deadline), { addSuffix: true })}
                </span>
              </div>
            )}

            {audition.compensation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-maasta-orange flex-shrink-0" />
                <span className="truncate">{audition.compensation}</span>
              </div>
            )}

            {(audition.age_range || audition.gender) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-maasta-orange flex-shrink-0" />
                <span className="truncate">
                  {[audition.age_range, audition.gender].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="p-4 pt-0 mt-auto">
          <div className="flex gap-2">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="flex-1 border-maasta-orange text-maasta-orange hover:bg-maasta-orange hover:text-white transition-colors"
              disabled={isExpired()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              onClick={handleViewDetails}
              className="flex-1 bg-maasta-orange hover:bg-maasta-orange/90 text-white transition-colors"
              disabled={isExpired()}
            >
              <Send className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
