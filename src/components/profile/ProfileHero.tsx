
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MapPin, Briefcase, ArrowLeft, Share2 } from "lucide-react";
import { Artist } from "@/types/artist";
import ShareProfileDialog from "./ShareProfileDialog";
import DownloadPortfolioPDF from "./DownloadPortfolioPDF";

interface ProfileHeroProps {
  artist: Artist;
  onEditProfile?: () => void;
  onBack?: () => void;
  isOwnProfile?: boolean;
}

const ProfileHero = ({ artist, onEditProfile, onBack, isOwnProfile = false }: ProfileHeroProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatExperience = (years: number, level: string) => {
    if (years === 0) return level.charAt(0).toUpperCase() + level.slice(1);
    return `${years} year${years !== 1 ? 's' : ''} • ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  };

  // Add cache busting to cover image URL
  const coverImageUrl = artist.cover_image_url ? 
    `${artist.cover_image_url}${artist.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}` : 
    null;

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative w-full h-64 bg-gradient-to-r from-maasta-orange/10 to-orange-50/30">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`${artist.full_name} cover`}
            className="w-full h-full object-cover"
            key={coverImageUrl} // Force re-render on URL change
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-maasta-orange/10 to-orange-50/30" />
        )}
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Image */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={artist.profile_picture_url ? `${artist.profile_picture_url}?t=${Date.now()}` : undefined} 
                      alt={artist.full_name}
                      className="object-cover"
                      key={`avatar-${artist.profile_picture_url || 'default'}-${Date.now()}`}
                    />
                    <AvatarFallback className="bg-maasta-orange text-white text-2xl font-bold">
                      {getInitials(artist.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {artist.full_name}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        {artist.category && (
                          <Badge variant="secondary" className="bg-maasta-orange/10 text-maasta-orange border-maasta-orange/20">
                            {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
                          </Badge>
                        )}
                        
                        {(artist.city || artist.state || artist.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>
                              {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {artist.years_of_experience !== undefined && artist.experience_level && (
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>{formatExperience(artist.years_of_experience, artist.experience_level)}</span>
                          </div>
                        )}
                      </div>

                      {artist.bio && (
                        <p className="text-gray-700 leading-relaxed max-w-2xl">
                          {artist.bio}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {onBack && (
                        <Button 
                          onClick={onBack}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </Button>
                      )}
                      {isOwnProfile && (
                        <DownloadPortfolioPDF 
                          artist={artist}
                          variant="default"
                          className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                        />
                      )}
                      {onEditProfile && (
                        <Button 
                          onClick={onEditProfile}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      )}
                      <Button
                        onClick={() => setIsShareDialogOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Share2 size={16} />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Profile Dialog */}
      <ShareProfileDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        artist={artist}
      />
    </div>
  );
};

export default ProfileHero;
