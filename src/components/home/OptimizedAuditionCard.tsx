
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Audition } from "@/types/audition";
import { AuditionApplicationButton } from "@/components/auditions/AuditionApplicationButton";
import { toast } from "sonner";

interface OptimizedAuditionCardProps {
  audition: Audition;
}

const ApplicationStatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold',
    shortlisted: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
    hired: 'bg-green-100 text-green-800 border-green-300 font-semibold',
    rejected: 'bg-red-100 text-red-800 border-red-300 font-semibold',
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

  const handleAlreadyApplied = () => {
    toast.info("You have already applied for this audition");
  };

  const hasApplied = !!audition.applicationStatus;

  return (
    <Card className="h-full flex flex-col bg-white overflow-hidden rounded-xl border-2 border-transparent hover:border-maasta-purple transition-all duration-300 shadow-md hover:shadow-2xl group">
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple font-semibold capitalize border-maasta-purple/20">
            {audition.category || 'General'}
          </Badge>
          <div className="flex items-center gap-2">
            {audition.applicationStatus && (
              <ApplicationStatusBadge status={audition.applicationStatus} />
            )}
            {(isUrgent || audition.urgent) && !audition.applicationStatus && (
              <Badge variant="destructive" className="text-xs font-bold animate-pulse">
                URGENT
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-extrabold text-xl text-gray-800 group-hover:text-maasta-purple transition-colors duration-300 leading-tight line-clamp-2 mb-2">
          {audition.title || 'Untitled Audition'}
        </h3>
        <p className="text-sm font-medium text-gray-500 mb-4">{audition.company || 'Company not listed'}</p>
        
        <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 text-maasta-orange flex-shrink-0" />
            <span className="text-sm truncate">{audition.location || 'Location TBD'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-3 text-maasta-purple flex-shrink-0" />
            <span className="text-sm">{audition.audition_date ? formatSafeDate(audition.audition_date) : 'Date TBD'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
            <span className="text-sm font-medium">{formatDeadline(audition.deadline)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
        <div className="flex gap-2">
          <Link to={`/auditions/${audition.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white font-bold text-sm py-2 rounded-lg transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
          
          {hasApplied ? (
            <Button 
              onClick={handleAlreadyApplied}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-2 rounded-lg"
            >
              Applied
            </Button>
          ) : (
            <AuditionApplicationButton
              auditionId={audition.id}
              auditionTitle={audition.title || 'Untitled Audition'}
              className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90 text-white font-bold text-sm py-2 rounded-lg"
            >
              Apply Now
            </AuditionApplicationButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OptimizedAuditionCard;
