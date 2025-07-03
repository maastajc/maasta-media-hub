
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Briefcase } from "lucide-react";
import { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
  onViewProfile: (artistId: string) => void;
}

const ArtistCard = ({ artist, onViewProfile }: ArtistCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewProfile = () => {
    if (artist.username) {
      onViewProfile(artist.username);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-maasta-orange/10 to-orange-50/30">
          {artist.cover_image_url && (
            <img
              src={artist.cover_image_url}
              alt={`${artist.full_name} cover`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Profile Picture */}
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarImage 
              src={artist.profile_picture_url} 
              alt={artist.full_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-maasta-orange text-white font-bold">
              {getInitials(artist.full_name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="pt-12 pb-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {artist.full_name}
            </h3>
            {artist.bio && (
              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                {artist.bio}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {artist.category && (
              <Badge variant="secondary" className="bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20 text-xs">
                {formatCategory(artist.category)}
              </Badge>
            )}
            {artist.experience_level && (
              <Badge variant="outline" className="text-xs">
                {artist.experience_level.charAt(0).toUpperCase() + artist.experience_level.slice(1)}
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            {(artist.city || artist.state || artist.country) && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span className="line-clamp-1">
                  {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            
            {artist.years_of_experience !== undefined && (
              <div className="flex items-center gap-1">
                <Briefcase size={14} />
                <span>
                  {artist.years_of_experience === 0 
                    ? 'Fresher' 
                    : `${artist.years_of_experience} year${artist.years_of_experience !== 1 ? 's' : ''} exp`
                  }
                </span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleViewProfile}
            className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white"
            size="sm"
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
