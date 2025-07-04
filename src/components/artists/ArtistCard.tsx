
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Artist } from "@/types/artist";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (artist.username) {
      navigate(`/artists/${artist.username}`);
    } else if (artist.full_name && artist.id) {
      const customUrl = generateCustomUrl(artist.full_name, artist.id);
      navigate(`/artists/${customUrl}`);
    } else {
      navigate(`/artists/${artist.id}`);
    }
  };

  const generateCustomUrl = (fullName: string, userId: string) => {
    const sanitizedName = fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 20);
    
    if (sanitizedName.length >= 3) {
      return sanitizedName;
    }
    
    return `guest-${userId.substring(0, 8)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-maasta-orange/30 h-full overflow-visible">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-br from-maasta-orange/10 to-orange-100 rounded-t-lg overflow-hidden">
          {artist.cover_image_url && (
            <img
              src={artist.cover_image_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {/* Profile Picture Overlay */}
          <div className="absolute -bottom-8 left-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage 
                src={artist.profile_picture_url || undefined} 
                alt={artist.full_name}
              />
              <AvatarFallback className="bg-maasta-orange text-white font-semibold">
                {getInitials(artist.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Content Area - Flex grow to push button to bottom */}
        <div className="pt-10 px-4 pb-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {artist.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {artist.category && (
                    <Badge 
                      variant="secondary" 
                      className="bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20 text-xs"
                    >
                      {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
                    </Badge>
                  )}
                  {artist.verified && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            {(artist.city || artist.state || artist.country) && (
              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">
                  {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {/* Bio */}
            {artist.bio && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {artist.bio}
              </p>
            )}

            {/* Skills/Experience */}
            <div className="space-y-2 mb-4">
              {artist.experience_level && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Experience:</span>
                  <span className="capitalize">{artist.experience_level}</span>
                  {artist.years_of_experience !== undefined && artist.years_of_experience > 0 && (
                    <span>({artist.years_of_experience} years)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Button - Always at bottom */}
          <div className="mt-auto pt-4">
            <Button
              onClick={handleViewProfile}
              className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white transition-colors"
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
