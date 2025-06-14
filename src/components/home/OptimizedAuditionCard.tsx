
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Audition } from "@/types/audition";

interface OptimizedAuditionCardProps {
  audition: Audition;
}

const ApplicationStatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    shortlisted: 'bg-blue-100 text-blue-800 border-blue-200',
    hired: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge variant="outline" className={`text-xs capitalize ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </Badge>
  );
};

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
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl border bg-white shadow-sm hover:-translate-y-1">
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple font-medium capitalize">
            {audition.category || 'General'}
          </Badge>
          <div className="flex items-center gap-2">
            {audition.applicationStatus && (
              <ApplicationStatusBadge status={audition.applicationStatus} />
            )}
            {(isUrgent || audition.urgent) && !audition.applicationStatus && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                Urgent
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 mb-1">
          {audition.title || 'Untitled Audition'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{audition.company || 'Company not listed'}</p>
        
        <div className="space-y-2.5 text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
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
            <span>{formatDeadline(audition.deadline)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-2">
        <Link to={`/auditions/${audition.id}`} className="w-full">
          <Button className="w-full bg-maasta-purple hover:bg-maasta-purple/90 text-white font-semibold">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default OptimizedAuditionCard;
