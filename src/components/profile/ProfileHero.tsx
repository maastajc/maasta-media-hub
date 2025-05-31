
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Star, 
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Film,
  ArrowLeft,
  Share,
  MessageCircle,
  Heart
} from "lucide-react";
import { Artist } from "@/types/artist";

interface ProfileHeroProps {
  artist: Artist;
  onBack?: () => void;
}

const ProfileHero = ({ artist, onBack }: ProfileHeroProps) => {
  const socialLinks = [
    { icon: Globe, url: artist.personal_website, label: 'Website' },
    { icon: Instagram, url: artist.instagram, label: 'Instagram' },
    { icon: Linkedin, url: artist.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: artist.youtube_vimeo, label: 'YouTube/Vimeo' },
    { icon: Film, url: artist.imdb_profile, label: 'IMDB' },
  ].filter(link => link.url);

  return (
    <div className="relative">
      {/* Cover Background */}
      <div className="h-80 bg-gradient-to-br from-maasta-purple via-maasta-orange to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 border border-white/25 rounded-full"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 left-6 z-20">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
        >
          <Share size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
        >
          <Heart size={20} />
        </Button>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-56 h-56 rounded-3xl shadow-xl border-4 border-white">
                <AvatarImage 
                  src={artist.profile_picture_url || ""} 
                  alt={artist.full_name || "Artist"}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl font-bold bg-maasta-purple text-white rounded-3xl">
                  {artist.full_name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {artist.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <Star size={16} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {artist.full_name || 'Unknown Artist'}
                </h1>
                
                {artist.category && (
                  <Badge className="bg-maasta-purple text-white px-6 py-2 text-lg font-medium rounded-full capitalize mb-4">
                    {artist.category.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              {/* Location & Experience */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6 text-gray-600">
                {(artist.city || artist.state || artist.country) && (
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-maasta-orange" />
                    <span className="text-lg">
                      {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {artist.experience_level && (
                  <div className="flex items-center">
                    <Star size={18} className="mr-2 text-maasta-purple" />
                    <span className="text-lg capitalize">
                      {artist.experience_level} Level
                      {artist.years_of_experience && (
                        <span className="ml-1 text-gray-500">
                          ({artist.years_of_experience} years)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {artist.bio && (
                <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl">
                  {artist.bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                <Button className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-8 py-3 rounded-full font-medium text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Artist
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium text-lg"
                >
                  View Portfolio
                </Button>
              </div>

              {/* Work Preferences */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {artist.work_preference && (
                  <Badge variant="outline" className="capitalize px-4 py-2 text-sm">
                    {artist.work_preference.replace('_', ' ')}
                  </Badge>
                )}
                {artist.willing_to_relocate && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm">
                    Open to Relocate
                  </Badge>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex lg:flex-col gap-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                      title={link.label}
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
