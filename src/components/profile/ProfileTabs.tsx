
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import MediaUploadSection from "@/components/profile/MediaUploadSection";
import SocialLinksForm from "@/components/profile/SocialLinksForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileTabsProps {
  profileData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refetch: () => void;
  userId?: string;
}
const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profileData,
  activeTab,
  setActiveTab,
  refetch,
  userId,
}) => (
  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
    <TabsList className="grid grid-cols-6 bg-white rounded-xl shadow-sm border">
      <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
      <TabsTrigger value="projects" className="rounded-lg">Projects</TabsTrigger>
      <TabsTrigger value="education" className="rounded-lg">Education</TabsTrigger>
      <TabsTrigger value="skills" className="rounded-lg">Skills</TabsTrigger>
      <TabsTrigger value="media" className="rounded-lg">Media</TabsTrigger>
      <TabsTrigger value="social" className="rounded-lg">Social</TabsTrigger>
    </TabsList>
    {/* Overview */}
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Profile Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Projects</span>
              <span className="font-semibold">{profileData?.projects?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skills</span>
              <span className="font-semibold">{profileData?.special_skills?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Education</span>
              <span className="font-semibold">{profileData?.education_training?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Media Assets</span>
              <span className="font-semibold">{profileData?.media_assets?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Profile updated</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">New project added</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Portfolio viewed</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Basic Info</span>
              <Badge variant={profileData?.full_name ? "default" : "secondary"}>
                {profileData?.full_name ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Projects</span>
              <Badge variant={profileData?.projects?.length ? "default" : "secondary"}>
                {profileData?.projects?.length ? "Complete" : "Add Projects"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Skills</span>
              <Badge variant={profileData?.special_skills?.length ? "default" : "secondary"}>
                {profileData?.special_skills?.length ? "Complete" : "Add Skills"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Projects */}
    <TabsContent value="projects">
      <ProjectsSection profileData={profileData} onUpdate={refetch} userId={userId} />
    </TabsContent>
    <TabsContent value="education">
      <EducationSection profileData={profileData} onUpdate={refetch} userId={userId} />
    </TabsContent>
    <TabsContent value="skills">
      <SkillsSection profileData={profileData} onUpdate={refetch} userId={userId} />
    </TabsContent>
    <TabsContent value="media">
      <MediaUploadSection profileData={profileData} onUpdate={refetch} userId={userId} />
    </TabsContent>
    <TabsContent value="social">
      <SocialLinksForm profileData={profileData} onUpdate={refetch} userId={userId} />
    </TabsContent>
  </Tabs>
);

export default ProfileTabs;
