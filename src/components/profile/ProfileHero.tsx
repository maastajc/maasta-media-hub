
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MapPin, Briefcase, ArrowLeft, Share2 } from "lucide-react";
import { Artist } from "@/types/artist";
import ShareProfileDialog from "./ShareProfileDialog";
import DownloadPortfolioPDF from "./DownloadPortfolioPDF";
import ProfilePictureUpload from "./ProfilePictureUpload";

interface ProfileHeroProps {
  artist: Artist;
  onEditProfile?: () => void;
  onBack?: () => void;
  isOwnProfile?: boolean;
  onProfileImageUpdate?: (imageUrl: string) => void;
}

const ProfileHero = ({ artist, onEditProfile, onBack, isOwnProfile = false, onProfileImageUpdate }: ProfileHeroProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showProfilePictureUpload, setShowProfilePictureUpload] = useState(false);

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

  const handleProfilePictureClick = () => {
    if (isOwnProfile) {
      setShowProfilePictureUpload(true);
    }
  };

  const handleProfileImageUpdate = (imageUrl: string) => {
    setShowProfilePictureUpload(false);
    onProfileImageUpdate?.(imageUrl);
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative w-full h-80 md:h-96 bg-gradient-to-r from-maasta-orange/10 to-orange-50/30">
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

      {/* Overlapping Profile Picture */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" 
           style={{ top: '75%' }}>
        <div 
          className="relative group cursor-pointer"
          onClick={handleProfilePictureClick}
        >
          <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <AvatarImage 
              src={artist.profile_picture_url ? `${artist.profile_picture_url}?t=${Date.now()}` : undefined} 
              alt={artist.full_name}
              className="object-cover"
              key={`avatar-${artist.profile_picture_url || 'default'}-${Date.now()}`}
            />
            <AvatarFallback className="bg-maasta-orange text-white text-xl md:text-2xl font-bold">
              {getInitials(artist.full_name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Edit Icon Overlay - Only show for own profile */}
          {isOwnProfile && (
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Edit size={20} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative pt-16 md:pt-20 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-12 md:pt-16 pb-8 px-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Profile Info */}
                <div className="space-y-6 max-w-4xl w-full">
                  {/* Name and Title */}
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {artist.full_name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
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
                      <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                        {artist.bio}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-3">
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

      {/* Profile Picture Upload Dialog */}
      {showProfilePictureUpload && artist.id && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
            <ProfilePictureUpload
              currentImageUrl={artist.profile_picture_url}
              userId={artist.id}
              onImageUpdate={handleProfileImageUpdate}
              fullName={artist.full_name}
            />
            <Button
              onClick={() => setShowProfilePictureUpload(false)}
              variant="outline"
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHero;
