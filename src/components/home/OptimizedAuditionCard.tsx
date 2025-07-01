
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  ExternalLink,
  IndianRupee
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface OptimizedAuditionCardProps {
  audition: {
    id: string;
    title: string;
    description?: string; // Made optional to match Audition type
    location: string;
    audition_date?: string;
    deadline?: string;
    compensation?: string;
    requirements?: string;
    status: string;
    category?: string;
    experience_level?: string;
    gender?: string;
    age_range?: string;
    tags?: string[];
    company?: string;
    created_at: string;
    applicationStatus?: string;
    creator_profile?: {
      full_name: string;
      profile_picture?: string;
      company?: string;
    };
  };
}

const OptimizedAuditionCard = ({ audition }: OptimizedAuditionCardProps) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = () => {
    navigate(`/auditions/${audition.id}`);
  };

  const creatorName = audition.creator_profile?.full_name || audition.company || 'Unknown Creator';
  const creatorImage = audition.creator_profile?.profile_picture;

  // Parse compensation to show amount and duration
  const parseCompensation = (compensation?: string) => {
    if (!compensation) return null;
    
    // Try to extract amount and duration from compensation string
    const match = compensation.match(/(\d+(?:,\d+)*)\s*(?:per\s+(day|month|project))?/i);
    if (match) {
      const amount = match[1];
      const duration = match[2] || '';
      return { amount, duration };
    }
    
    return { amount: compensation, duration: '' };
  };

  const compensationInfo = parseCompensation(audition.compensation);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-maasta-orange/20">
              {!imageError && creatorImage ? (
                <AvatarImage 
                  src={creatorImage} 
                  alt={creatorName}
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <AvatarFallback className="bg-maasta-orange text-white font-semibold">
                  {getInitials(creatorName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{creatorName}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(audition.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {audition.applicationStatus && (
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(audition.applicationStatus)}`}
            >
              {audition.applicationStatus}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-maasta-purple transition-colors leading-tight">
          {audition.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        {audition.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {audition.description}
          </p>
        )}

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-maasta-orange flex-shrink-0" />
            <span className="truncate">{audition.location}</span>
          </div>

          {/* Salary with Duration */}
          {compensationInfo && (
            <div className="flex items-center text-sm text-gray-600">
              <IndianRupee className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
              <span className="font-medium text-green-700">
                ₹{compensationInfo.amount}
                {compensationInfo.duration && (
                  <span className="text-gray-500 ml-1">per {compensationInfo.duration}</span>
                )}
              </span>
            </div>
          )}

          {/* Deadline */}
          {audition.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
              <span>Deadline: {new Date(audition.deadline).toLocaleDateString()}</span>
            </div>
          )}

          {/* Audition Date */}
          {audition.audition_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
              <span>Audition: {new Date(audition.audition_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          {audition.category && (
            <Badge variant="secondary" className="text-xs bg-maasta-purple/10 text-maasta-purple border-maasta-purple/20">
              {audition.category}
            </Badge>
          )}
          {audition.experience_level && (
            <Badge variant="outline" className="text-xs">
              {audition.experience_level}
            </Badge>
          )}
          {audition.age_range && (
            <Badge variant="outline" className="text-xs">
              Age: {audition.age_range}
            </Badge>
          )}
          {audition.gender && audition.gender !== 'any' && (
            <Badge variant="outline" className="text-xs">
              {audition.gender}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {audition.tags && audition.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {audition.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                {tag}
              </Badge>
            ))}
            {audition.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{audition.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white font-medium"
          size="sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  );
};

export default OptimizedAuditionCard;

