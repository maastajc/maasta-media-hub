
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchArtistById } from "@/services/artist/artistById";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Briefcase, GraduationCap, Brain, FileText, Award } from "lucide-react";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import MediaSection from "@/components/profile/MediaSection";
import AwardsSection from "@/components/profile/AwardsSection";
import UnifiedProfileView from "@/components/profile/UnifiedProfileView";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: profileData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["artistProfile", user?.id],
    queryFn: () => fetchArtistById(user?.id || ""),
    enabled: !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleProfileUpdate = () => {
    refetch();
    toast.success("Profile updated successfully!");
  };

  useEffect(() => {
    if (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            Failed to load profile. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No profile data found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHero artist={profileData} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User size={16} />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap size={16} />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Brain size={16} />
              Skills
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-2">
              <Award size={16} />
              Awards
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <FileText size={16} />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <UnifiedProfileView artist={profileData} />
          </TabsContent>

          <TabsContent value="basic">
            <ProfileEditForm
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="media">
            <MediaSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              userId={user?.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
