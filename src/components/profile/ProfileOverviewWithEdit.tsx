
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Artist } from "@/types/artist";

interface ProfileOverviewWithEditProps {
  artist: Artist;
  isOwnProfile: boolean;
  onEditBasicInfo: () => void;
  onEditWorkPreferences: () => void;
  onEditPortfolioLinks: () => void;
}

const ProfileOverviewWithEdit = ({ 
  artist, 
  isOwnProfile, 
  onEditBasicInfo, 
  onEditWorkPreferences, 
  onEditPortfolioLinks 
}: ProfileOverviewWithEditProps) => {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Overview
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditBasicInfo}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {artist.bio && (
            <div>
              <p className="text-sm text-gray-600">{artist.bio}</p>
            </div>
          )}
          {artist.headline && (
            <div>
              <p className="text-sm font-medium text-gray-500">Headline</p>
              <p className="text-sm italic">"{artist.headline}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Basic Information
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditBasicInfo}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-sm">{artist.full_name || 'Not provided'}</p>
            </div>
            {artist.username && (
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-sm">@{artist.username}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-sm">
                {[artist.city, artist.state, artist.country].filter(Boolean).join(', ') || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm">{artist.phone_number || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Work Preferences
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditWorkPreferences}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Profession</p>
              <p className="text-sm capitalize">
                {artist.work_preferences && artist.work_preferences.length > 0 
                  ? artist.work_preferences.map(pref => pref.replace('_', ' ')).join(', ')
                  : artist.category?.replace('_', ' ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Work Type</p>
              <p className="text-sm capitalize">{artist.work_preference?.replace('_', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Experience</p>
              <p className="text-sm capitalize">{artist.experience_level || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Years</p>
              <p className="text-sm">{artist.years_of_experience || 0} years</p>
            </div>
          </div>
          {artist.preferred_domains && (
            <div>
              <p className="text-sm font-medium text-gray-500">Available For</p>
              <p className="text-sm">{artist.preferred_domains}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Portfolio
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditPortfolioLinks}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artist.personal_website && (
              <div>
                <p className="text-sm font-medium text-gray-500">Personal Website</p>
                <a href={artist.personal_website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {artist.personal_website}
                </a>
              </div>
            )}
            {artist.imdb_profile && (
              <div>
                <p className="text-sm font-medium text-gray-500">IMDb Profile</p>
                <a href={artist.imdb_profile} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View IMDb Profile
                </a>
              </div>
            )}
            {artist.instagram && (
              <div>
                <p className="text-sm font-medium text-gray-500">Instagram</p>
                <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  @{artist.instagram.split('/').pop()}
                </a>
              </div>
            )}
            {artist.linkedin && (
              <div>
                <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                <a href={artist.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View LinkedIn Profile
                </a>
              </div>
            )}
          </div>
          {!artist.personal_website && !artist.imdb_profile && !artist.instagram && !artist.linkedin && (
            <p className="text-sm text-gray-500 italic">No portfolio links provided</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewWithEdit;
