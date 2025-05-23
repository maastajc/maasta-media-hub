
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDaysRemaining } from "@/utils/auditionHelpers";
import { DEFAULT_COVER } from "@/utils/auditionHelpers";
import { Audition } from "@/types/audition";

interface AuditionCardProps {
  audition: Audition;
}

const AuditionCard = ({ audition }: AuditionCardProps) => {
  const daysRemaining = getDaysRemaining(audition.deadline);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Cover image */}
      <div className="h-32 overflow-hidden">
        <img
          src={audition.cover_image_url || DEFAULT_COVER}
          alt={audition.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = DEFAULT_COVER;
          }}
        />
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{audition.title}</h3>
          {audition.urgent && (
            <Badge className="bg-red-500">Urgent</Badge>
          )}
        </div>
        <p className="text-maasta-purple font-medium text-sm mt-1">{audition.company}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {audition.location}
        </div>
        
        {audition.requirements && (
          <div className="mt-2 text-sm">
            <p className="font-medium">Requirements:</p>
            <p className="text-gray-600 line-clamp-2">{audition.requirements}</p>
          </div>
        )}
        
        {audition.tags && audition.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {audition.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
            {audition.tags.length > 3 && (
              <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                +{audition.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            {daysRemaining !== null ? (
              <>
                <span className="font-medium">Deadline:</span> 
                <span className={`ml-1 ${daysRemaining <= 5 ? "text-red-500" : "text-gray-600"}`}>
                  {daysRemaining} days left
                </span>
              </>
            ) : (
              <span className="text-gray-600">Open until filled</span>
            )}
          </div>
          <Link to={`/auditions/${audition.id}`}>
            <Button size="sm" className="bg-maasta-purple hover:bg-maasta-purple/90">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditionCard;
