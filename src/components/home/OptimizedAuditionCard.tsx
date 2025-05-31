
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Audition } from "@/types/audition";

interface OptimizedAuditionCardProps {
  audition: Audition;
}

const OptimizedAuditionCard = ({ audition }: OptimizedAuditionCardProps) => {
  const isUrgent = audition.deadline ? 
    new Date(audition.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 : false;

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-maasta-purple">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple">
            {audition.category || 'General'}
          </Badge>
          {(isUrgent || audition.urgent) && (
            <Badge variant="destructive" className="text-xs">
              Urgent
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-2">
          {audition.title}
        </h3>
        {audition.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {audition.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-maasta-orange" />
            <span className="truncate">{audition.location}</span>
          </div>
          
          {audition.audition_date && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2 text-maasta-purple" />
              <span>{format(new Date(audition.audition_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {audition.deadline && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2 text-maasta-orange" />
              <span>Apply by {format(new Date(audition.deadline), 'MMM dd')}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2 text-maasta-purple" />
            <span className="capitalize">{audition.experience_level || 'Any'} level</span>
          </div>
          
          {audition.compensation && (
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              <span className="truncate">{audition.compensation}</span>
            </div>
          )}
        </div>
        
        <Link to={`/auditions/${audition.id}`}>
          <Button className="w-full bg-maasta-purple hover:bg-maasta-purple/90 text-white">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OptimizedAuditionCard;
