
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuditionCardProps {
  audition: {
    id: string;
    audition_number?: number;
    title: string;
    category: string;
    location: string;
    deadline?: string;
    audition_date?: string;
    compensation?: string;
    description?: string;
    created_at: string;
    profiles?: {
      full_name: string;
      profile_picture_url?: string;
      verified?: boolean;
    };
  };
}

const AuditionCard = ({ audition }: AuditionCardProps) => {
  const auditionUrl = audition.audition_number 
    ? `/auditions/${audition.audition_number}` 
    : `/auditions/${audition.id}`;

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {audition.audition_number && (
                <Badge variant="secondary" className="text-xs">
                  #{audition.audition_number}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {audition.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2">
              {audition.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Location and Dates */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{audition.location}</span>
          </div>
          
          {audition.audition_date && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span>Audition: {new Date(audition.audition_date).toLocaleDateString()}</span>
            </div>
          )}
          
          {audition.deadline && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              <span>Deadline: {new Date(audition.deadline).toLocaleDateString()}</span>
            </div>
          )}
          
          {audition.compensation && (
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 flex-shrink-0 text-green-600" />
              <span className="text-green-700 font-medium">{audition.compensation}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {audition.description && (
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {truncateText(audition.description, 120)}
          </p>
        )}

        {/* Posted By */}
        {audition.profiles && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {audition.profiles.profile_picture_url ? (
                  <img 
                    src={audition.profiles.profile_picture_url} 
                    alt={audition.profiles.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-600 font-medium">
                    {audition.profiles.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  by {audition.profiles.full_name}
                  {audition.profiles.verified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(audition.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link to={auditionUrl} className="block">
          <Button className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AuditionCard;
