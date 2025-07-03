
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const profileUrl = artist.username ? `/artists/${artist.username}` : `/artists/${artist.id}`;
  const displayLocation = [artist.city, artist.state, artist.country].filter(Boolean).join(", ");

  return (
    <Link to={profileUrl} className="block group">
      <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] border-gray-200">
        <CardContent className="p-0">
          {/* Profile Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
            {artist.profile_picture_url ? (
              <img
                src={artist.profile_picture_url}
                alt={artist.full_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maasta-orange/20 to-maasta-orange/40">
                <span className="text-4xl font-bold text-maasta-orange">
                  {artist.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {artist.verified && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-maasta-orange transition-colors line-clamp-1">
                {artist.full_name}
              </h3>
              {artist.username && (
                <p className="text-sm text-gray-500">@{artist.username}</p>
              )}
            </div>

            {/* Category and Experience */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize text-xs">
                {artist.category?.replace('_', ' ')}
              </Badge>
              {artist.experience_level && (
                <Badge variant="secondary" className="capitalize text-xs">
                  {artist.experience_level.replace('_', ' ')}
                </Badge>
              )}
            </div>

            {/* Location */}
            {displayLocation && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{displayLocation}</span>
              </div>
            )}

            {/* Bio Preview */}
            {artist.bio && (
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {artist.bio}
              </p>
            )}

            {/* Skills Preview */}
            {artist.skills && artist.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {artist.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    {skill}
                  </Badge>
                ))}
                {artist.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    +{artist.skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArtistCard;
