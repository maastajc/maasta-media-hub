
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHero from "./ProfileHero";
import ProfileOverviewWithEdit from "./ProfileOverviewWithEdit";
import MediaSection from "./MediaSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import EducationSection from "./EducationSection";
import AwardsSection from "./AwardsSection";
import SocialLinksForm from "./SocialLinksForm";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { Artist } from "@/types/artist";
import ShareProfileDialog from "./ShareProfileDialog";

interface UnifiedProfileViewProps {
  artist: Artist;
  isOwner?: boolean;
  onProfileUpdate?: () => void;
}

const UnifiedProfileView = ({ artist, isOwner = false, onProfileUpdate }: UnifiedProfileViewProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    onProfileUpdate?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHero
        artist={artist}
        isOwner={isOwner}
        onEditClick={handleEditToggle}
        onShareClick={() => setShowShareDialog(true)}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <ProfileOverviewWithEdit
              artist={artist}
              isOwner={isOwner}
              isEditing={isEditing}
              onSave={handleProfileUpdate}
            />

            {/* Media Section - Moved after Overview */}
            <MediaSection
              profileData={artist}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />

            {/* Portfolio Links - Moved after Media */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Portfolio Links
                </h3>
                <SocialLinksForm
                  profileData={artist}
                  onUpdate={handleProfileUpdate}
                  userId={user?.id}
                />
              </div>
            )}

            {/* Projects Section */}
            <ProjectsSection
              profileData={artist}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />

            {/* Skills Section */}
            <SkillsSection
              artist={artist}
              isOwner={isOwner}
              isEditing={isEditing}
            />

            {/* Education Section */}
            <EducationSection
              profileData={artist}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />

            {/* Awards Section */}
            <AwardsSection
              artist={artist}
              isOwner={isOwner}
              isEditing={isEditing}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Edit Toggle Button for Mobile */}
            {isOwner && (
              <div className="lg:hidden">
                <Button
                  onClick={handleEditToggle}
                  variant={isEditing ? "destructive" : "default"}
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
              </div>
            )}

            {/* Portfolio Links Display (when not editing) */}
            {!isEditing && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Links</h3>
                <div className="space-y-3">
                  {artist.personal_website && (
                    <a
                      href={artist.personal_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Personal Website
                    </a>
                  )}
                  {artist.linkedin && (
                    <a
                      href={artist.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {artist.youtube_vimeo && (
                    <a
                      href={artist.youtube_vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      YouTube/Vimeo
                    </a>
                  )}
                  {artist.imdb_profile && (
                    <a
                      href={artist.imdb_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      IMDb Profile
                    </a>
                  )}
                  {artist.behance && (
                    <a
                      href={artist.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Behance
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Member since:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(artist.created_at).toLocaleDateString()}
                  </span>
                </div>
                {artist.verified && (
                  <div className="flex items-center">
                    <span className="text-green-600">✓ Verified Profile</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareProfileDialog
        artist={artist}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </div>
  );
};

export default UnifiedProfileView;
