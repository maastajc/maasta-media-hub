
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, ExternalLink } from "lucide-react";
import { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
  onViewProfile?: (artistId: string) => void;
}

const ArtistCard = ({ artist, onViewProfile }: ArtistCardProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleViewProfile = () => {
    navigate(`/artists/${artist.id}`);
  };

  const truncateBio = (bio: string, maxLength: number = 120) => {
    if (bio.length <= maxLength) return bio;
    return bio.slice(0, maxLength).trim() + '...';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage 
              src={artist.profile_picture_url} 
              alt={artist.full_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-maasta-orange text-white font-semibold text-lg">
              {getInitials(artist.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-maasta-purple transition-colors">
              {artist.full_name}
            </h3>
            {artist.category && (
              <Badge variant="secondary" className="text-xs bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20 mt-1">
                {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Bio - Always Display */}
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {artist.bio ? truncateBio(artist.bio) : 'No bio available'}
            </p>
          </div>

          {/* Location - Always Display */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-maasta-orange" />
            <span className="truncate">
              {[artist.city, artist.state, artist.country].filter(Boolean).join(', ') || 'Location not specified'}
            </span>
          </div>

          {/* Headline if available */}
          {artist.headline && (
            <div>
              <p className="text-sm text-gray-600 font-medium italic">
                "{artist.headline}"
              </p>
            </div>
          )}

          {/* View Profile Button */}
          <div className="pt-2">
            <Button 
              onClick={handleViewProfile}
              className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
