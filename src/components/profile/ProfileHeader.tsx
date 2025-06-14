
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import { Eye, Edit, MapPin, Share2, Settings } from "lucide-react";

export interface ProfileHeaderProps {
  profileData: any;
  user: any;
  onEdit: () => void;
  onViewPublic: () => void;
  onShare: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  user,
  onEdit,
  onViewPublic,
  onShare,
}) => {
  // Social links for the header
  const socialLinks = [
    { icon: "Globe", url: profileData?.personal_website },
    { icon: "Instagram", url: profileData?.instagram },
    { icon: "Linkedin", url: profileData?.linkedin },
    { icon: "Youtube", url: profileData?.youtube_vimeo },
  ].filter(link => link.url);

  return (
    <div className="relative bg-white p-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <ProfilePictureUpload
          currentImageUrl={profileData?.profile_picture_url}
          userId={user?.id || ""}
          onImageUpdate={() => {}}
          fullName={profileData?.full_name}
        />
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {profileData?.full_name === 'New User'
                ? 'Complete Your Profile'
                : profileData?.full_name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-500 hover:text-maasta-purple"
            >
              <Edit size={16} />
            </Button>
          </div>
          {profileData?.category && (
            <div className="flex justify-center lg:justify-start mb-4">
              <Badge className="bg-maasta-purple text-white px-4 py-2 text-lg font-medium rounded-full">
                {profileData.category}
              </Badge>
            </div>
          )}
          {(profileData?.city || profileData?.state || profileData?.country) && (
            <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
              <MapPin size={20} className="mr-2" />
              <span className="text-lg">
                {[profileData?.city, profileData?.state, profileData?.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {profileData?.bio && (
            <p className="text-gray-700 mb-6 max-w-2xl">{profileData.bio}</p>
          )}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Button
              onClick={onViewPublic}
              className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-8 py-3 rounded-full font-medium"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Public Profile
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Profile
            </Button>
            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
              disabled
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        {socialLinks.length > 0 && (
          <div className="flex lg:flex-col gap-4">
            {/* Optionally show icons with links */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
