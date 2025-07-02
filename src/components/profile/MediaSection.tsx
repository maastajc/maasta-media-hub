
import MediaUploadSection from "./MediaUploadSection";

interface MediaSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const MediaSection = ({ profileData, onUpdate, userId }: MediaSectionProps) => {
  return (
    <MediaUploadSection 
      profileData={profileData} 
      onUpdate={onUpdate}
      userId={userId}
    />
  );
};

export default MediaSection;
