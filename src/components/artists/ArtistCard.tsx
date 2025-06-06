
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Artist {
  id: string;
  full_name: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  country?: string;
  skills?: string[];
  verified?: boolean;
}

interface ArtistCardProps {
  artist: Artist;
  onViewProfile: (artistId: string) => void;
}

const ArtistCard = ({ artist, onViewProfile }: ArtistCardProps) => {
  const getLocationString = (artist: Artist) => {
    const parts = [artist.city, artist.state, artist.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  // Get the first letter of the name for avatar fallback
  const getAvatarLetter = () => {
    if (artist.full_name && artist.full_name !== 'New User') {
      return artist.full_name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-64">
        {artist.profile_picture_url ? (
          <img
            src={artist.profile_picture_url}
            alt={artist.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Avatar className="w-32 h-32">
              <AvatarImage src="" alt={artist.full_name} />
              <AvatarFallback className="text-4xl font-bold bg-maasta-purple text-white">
                {getAvatarLetter()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        {artist.verified && (
          <div className="absolute top-2 right-2 bg-maasta-purple text-white text-xs p-1 px-2 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            Verified
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{artist.full_name}</h3>
        <p className="text-gray-500 text-sm mb-3">{getLocationString(artist)}</p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{artist.bio}</p>
        <div className="flex flex-wrap mb-3">
          {artist.skills?.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="tag">
              {skill}
            </span>
          ))}
          {(artist.skills?.length || 0) > 3 && (
            <span className="tag">+{(artist.skills?.length || 0) - 3} more</span>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5"
          onClick={() => onViewProfile(artist.id)}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
