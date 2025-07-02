
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Eye } from "lucide-react";
import { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
  onViewProfile: (artistId: string) => void;
}

const ArtistCard = ({ artist, onViewProfile }: ArtistCardProps) => {
  const formatPricing = (rateCard: any) => {
    if (!rateCard || typeof rateCard !== 'object') return null;
    
    const rates = [];
    if (rateCard.daily_rate) rates.push(`₹${rateCard.daily_rate}/day`);
    if (rateCard.hourly_rate) rates.push(`₹${rateCard.hourly_rate}/hr`);
    if (rateCard.project_rate) rates.push(`₹${rateCard.project_rate}/project`);
    
    return rates.length > 0 ? rates.join(' • ') : null;
  };

  const pricing = formatPricing(artist.rate_card);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-r from-maasta-purple to-blue-600 overflow-hidden">
          {artist.cover_image_url ? (
            <img
              src={artist.cover_image_url}
              alt={`${artist.full_name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-maasta-purple to-blue-600" />
          )}
        </div>

        {/* Profile Section */}
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-8 left-6">
            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {artist.profile_picture_url ? (
                <img
                  src={artist.profile_picture_url}
                  alt={artist.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {artist.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-10">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {artist.full_name}
              </h3>
              {artist.headline && (
                <p className="text-sm text-gray-600 mb-2">{artist.headline}</p>
              )}
              
              {/* Category and Experience */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple">
                  {artist.category}
                </Badge>
                {artist.experience_level && (
                  <Badge variant="outline">
                    {artist.experience_level}
                  </Badge>
                )}
              </div>
            </div>

            {/* Location and Experience */}
            <div className="space-y-2 mb-4">
              {(artist.city || artist.state) && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {[artist.city, artist.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              
              {artist.years_of_experience > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{artist.years_of_experience} years experience</span>
                </div>
              )}

              {pricing && (
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  <span>{pricing}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {artist.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {artist.bio}
              </p>
            )}

            {/* Skills */}
            {artist.skills && artist.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {artist.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {artist.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{artist.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={() => onViewProfile(artist.id)}
              className="w-full bg-maasta-purple hover:bg-maasta-purple/90"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
