
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Audition } from "@/types/audition";

interface OptimizedAuditionCardProps {
  audition: Audition;
}

const OptimizedAuditionCard = ({ audition }: OptimizedAuditionCardProps) => {
  const isUrgent = audition.deadline ? 
    new Date(audition.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 : false;

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-maasta-purple/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-maasta-purple" />
            </div>
            <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple font-medium">
              {audition.category || 'General'}
            </Badge>
          </div>
          {(isUrgent || audition.urgent) && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              Urgent
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-xl leading-tight line-clamp-2 text-gray-900">
          {audition.title}
        </h3>
        {audition.description && (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {audition.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-maasta-orange flex-shrink-0" />
            <span className="truncate font-medium">{audition.location}</span>
          </div>
          
          {audition.audition_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
              <span className="font-medium">{format(new Date(audition.audition_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {audition.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-3 text-maasta-orange flex-shrink-0" />
              <span className="font-medium">Apply by {format(new Date(audition.deadline), 'MMM dd')}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
            <span className="capitalize font-medium">{audition.experience_level || 'Any'} level</span>
          </div>
          
          {audition.compensation && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
              <span className="truncate font-medium text-green-700">{audition.compensation}</span>
            </div>
          )}
        </div>
        
        <Link to={`/auditions/${audition.id}`} className="block">
          <Button className="w-full bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            View Details & Apply
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OptimizedAuditionCard;
