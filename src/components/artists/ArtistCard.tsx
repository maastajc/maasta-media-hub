
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User, ExternalLink, Instagram, Linkedin, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
  onViewProfile?: (artistId: string) => void;
}

const ArtistCard = ({ artist, onViewProfile }: ArtistCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleViewProfile = () => {
    // Navigate to the public profile page with the correct URL format
    navigate(`/artists/${artist.id}`);
  };

  const socialLinks = [
    { icon: Globe, url: artist.personal_website, label: 'Website' },
    { icon: Instagram, url: artist.instagram, label: 'Instagram' },
    { icon: Linkedin, url: artist.linkedin, label: 'LinkedIn' },
  ].filter(link => link.url);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
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
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  {artist.category && (
                    <Badge variant="secondary" className="text-xs bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20">
                      {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Location */}
            {(artist.city || artist.state || artist.country) && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {/* Experience */}
            {artist.experience_level && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  {artist.years_of_experience ? `${artist.years_of_experience} years • ` : ''}
                  {artist.experience_level.charAt(0).toUpperCase() + artist.experience_level.slice(1)}
                </span>
              </div>
            )}

            {/* Bio Preview */}
            {artist.bio && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {artist.bio}
              </p>
            )}

            {/* Skills Preview */}
            {artist.skills && artist.skills.length > 0 && (
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
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleViewProfile}
                className="flex-1 bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="border-maasta-orange/20 hover:bg-maasta-orange/5"
              >
                Quick View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={artist.profile_picture_url} 
                  alt={artist.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-maasta-orange text-white font-semibold">
                  {getInitials(artist.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{artist.full_name}</div>
                {artist.category && (
                  <div className="text-sm text-gray-600 font-normal">
                    {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
                  </div>
                )}
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm">
                {/* Location */}
                {(artist.city || artist.state || artist.country) && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                  </div>
                )}

                {/* Bio */}
                {artist.bio && (
                  <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-2">
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-maasta-orange hover:text-white rounded-full text-xs transition-colors"
                        >
                          <Icon size={14} />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    onClick={handleViewProfile}
                    className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistCard;
