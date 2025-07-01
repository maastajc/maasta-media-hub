
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, Users, DollarSign, Briefcase, User } from "lucide-react";
import { format } from "date-fns";
import { getDaysRemaining } from "@/utils/auditionHelpers";
import { Audition } from "@/types/audition";
import { AuditionApplicationButton } from "@/components/auditions/AuditionApplicationButton";
import { toast } from "sonner";

interface AuditionCardProps {
  audition: Audition;
}

const AuditionCard = ({ audition }: AuditionCardProps) => {
  const daysRemaining = getDaysRemaining(audition.deadline);
  const hasApplied = !!audition.applicationStatus;
  
  // Check if audition date has passed
  const isExpired = audition.audition_date ? new Date(audition.audition_date) < new Date() : false;
  
  // Check if deadline has passed
  const isDeadlinePassed = audition.deadline ? new Date(audition.deadline) < new Date() : false;
  
  // Card is closed if either audition date or deadline has passed
  const isClosed = isExpired || isDeadlinePassed;

  const handleAlreadyApplied = () => {
    toast.info("You have already applied for this audition");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 relative">
      {/* Closed badge in top-right corner */}
      {isClosed && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 font-semibold">
            Closed
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-maasta-purple/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-maasta-purple" />
            </div>
            {audition.category && (
              <Badge className="bg-maasta-purple/10 text-maasta-purple font-medium">
                {audition.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {audition.applicationStatus && !isClosed && (
              <Badge variant="outline" className="text-xs capitalize bg-green-100 text-green-800 border-green-300 font-semibold">
                {audition.applicationStatus}
              </Badge>
            )}
            {audition.urgent && !audition.applicationStatus && !isClosed && (
              <Badge className="bg-red-500 text-white animate-pulse">Urgent</Badge>
            )}
          </div>
        </div>
        
        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900">{audition.title}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-maasta-orange flex-shrink-0" />
            <span className="font-medium">{audition.location}</span>
          </div>
          
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
            <span className="capitalize font-medium">{audition.experience_level || 'Any'} level</span>
          </div>
          
          {audition.compensation && (
            <div className="flex items-center text-sm text-green-700">
              <DollarSign className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
              <span className="font-medium">{audition.compensation}</span>
            </div>
          )}
        </div>
        
        {audition.tags && audition.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1">
            {audition.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
            {audition.tags.length > 3 && (
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                +{audition.tags.length - 3}
              </span>
            )}
          </div>
        )}
        

        {/* Posted by Profile Section - moved before buttons */}
        {audition.posterProfile && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={audition.posterProfile.profile_picture} 
                alt={audition.posterProfile.full_name}
              />
              <AvatarFallback className="bg-maasta-orange text-white font-semibold text-xs">
                {getInitials(audition.posterProfile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Posted by {audition.posterProfile.full_name}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Link to={`/auditions/${audition.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white font-semibold py-2 rounded-lg transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
          
          {isClosed ? (
            <Button 
              disabled
              className="flex-1 bg-gray-400 text-white font-semibold py-2 rounded-lg cursor-not-allowed"
            >
              Closed
            </Button>
          ) : hasApplied ? (
            <Button 
              onClick={handleAlreadyApplied}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Applied
            </Button>
          ) : (
            <AuditionApplicationButton
              auditionId={audition.id}
              auditionTitle={audition.title}
              className="flex-1 bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              hasApplied={hasApplied}
            >
              Apply Now
            </AuditionApplicationButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditionCard;
