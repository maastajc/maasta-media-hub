
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Audition } from "@/types/audition";

interface OptimizedAuditionCardProps {
  audition: Audition;
}

const OptimizedAuditionCard = ({ audition }: OptimizedAuditionCardProps) => {
  const isUrgent = audition.deadline ? 
    new Date(audition.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 : false;

  const formatSafeDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'TBD';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDeadline = (dateString: string | undefined | null) => {
    if (!dateString) return 'No deadline';
    try {
      return `Apply by ${format(new Date(dateString), 'MMM dd')}`;
    } catch {
      return 'Invalid deadline';
    }
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl border bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple font-medium capitalize">
            {audition.category || 'General'}
          </Badge>
          {(isUrgent || audition.urgent) && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              Urgent
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900">
          {audition.title || 'Untitled Audition'}
        </h3>
        <p className="text-sm text-gray-500">{audition.company || 'Company not listed'}</p>
      </CardHeader>
      
      <CardContent className="pt-0 flex-grow">
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2.5 text-maasta-orange flex-shrink-0" />
            <span className="truncate">{audition.location || 'Location TBD'}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2.5 text-maasta-purple flex-shrink-0" />
            <span>{audition.audition_date ? formatSafeDate(audition.audition_date) : 'Date TBD'}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2.5 text-maasta-orange flex-shrink-0" />
            <span>{audition.deadline ? formatDeadline(audition.deadline) : 'No deadline'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 mt-auto">
        <Link to={`/auditions/${audition.id}`} className="w-full">
          <Button className="w-full bg-maasta-purple hover:bg-maasta-purple/90 text-white font-semibold">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OptimizedAuditionCard;
