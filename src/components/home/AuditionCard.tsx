
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Users, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { getDaysRemaining } from "@/utils/auditionHelpers";
import { Audition } from "@/types/audition";

interface AuditionCardProps {
  audition: Audition;
}

const AuditionCard = ({ audition }: AuditionCardProps) => {
  const daysRemaining = getDaysRemaining(audition.deadline);
  
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
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
          {audition.urgent && (
            <Badge className="bg-red-500 text-white animate-pulse">Urgent</Badge>
          )}
        </div>
        
        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900">{audition.title}</h3>
        <p className="text-maasta-purple font-medium text-sm mb-4">{audition.company}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-maasta-orange flex-shrink-0" />
            <span className="font-medium">{audition.location}</span>
          </div>
          
          {audition.audition_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
              <span className="font-medium">{format(new Date(audition.audition_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
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
        
        {audition.requirements && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">{audition.requirements}</p>
          </div>
        )}
        
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
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            {daysRemaining !== null ? (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-maasta-orange" />
                <span className={`font-medium ${daysRemaining <= 5 ? "text-red-600" : "text-gray-600"}`}>
                  {daysRemaining} days left
                </span>
              </div>
            ) : (
              <span className="text-gray-600">Open until filled</span>
            )}
          </div>
        </div>
        
        <Link to={`/auditions/${audition.id}`}>
          <Button className="w-full bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white font-semibold py-3 rounded-lg transition-all duration-300">
            View Details & Apply
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AuditionCard;
