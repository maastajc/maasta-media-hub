import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Edit, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Plus,
  Camera,
  Settings
} from "lucide-react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProjectsSection from "@/components/profile/ProjectsSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import MediaSection from "@/components/profile/MediaSection";
import SocialLinksForm from "@/components/profile/SocialLinksForm";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            artist_details (*),
            projects (*),
            education_training (*),
            special_skills (*),
            language_skills (*),
            tools_software (*),
            media_assets (*)
          `)
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        setProfileData(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate, toast]);

  const handleViewPublicProfile = () => {
    navigate(`/artists/${user?.id}`);
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        artist_details (*),
        projects (*),
        education_training (*),
        special_skills (*),
        language_skills (*),
        tools_software (*),
        media_assets (*)
      `)
      .eq("id", user.id)
      .single();
    
    if (!error && data) {
      setProfileData(data);
    }
  };

  const handleProfilePictureUpdate = async (imageUrl: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_picture_url: imageUrl })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfileData((prev: any) => ({ 
        ...prev, 
        profile_picture_url: imageUrl 
      }));
      
    } catch (error: any) {
      console.error("Error updating profile picture:", error.message);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const socialLinks = [
    { icon: Globe, url: profileData?.personal_website, label: 'Website' },
    { icon: Instagram, url: profileData?.instagram, label: 'Instagram' },
    { icon: Linkedin, url: profileData?.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: profileData?.youtube_vimeo, label: 'YouTube/Vimeo' },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Profile Header - Live Preview Style */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-maasta-purple via-maasta-orange to-purple-600"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-white p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    
                    {/* Profile Picture with Upload */}
                    <ProfilePictureUpload
                      currentImageUrl={profileData?.profile_picture_url}
                      userId={user?.id || ""}
                      onImageUpdate={handleProfilePictureUpdate}
                      fullName={profileData?.full_name}
                    />

                    {/* Main Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{profileData?.full_name || 'Your Name'}</h1>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingProfile(true)}
                          className="text-gray-500 hover:text-maasta-purple"
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                      
                      {profileData?.artist_details?.[0]?.category && (
                        <div className="flex justify-center lg:justify-start mb-4">
                          <Badge className="bg-maasta-purple text-white px-4 py-2 text-lg font-medium rounded-full">
                            {profileData.artist_details[0].category}
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

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <Button 
                          onClick={handleViewPublicProfile}
                          className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-8 py-3 rounded-full font-medium"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          View Public Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium"
                        >
                          <Settings className="w-5 h-5 mr-2" />
                          Settings
                        </Button>
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
                              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300"
                            >
                              <Icon size={20} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-6 bg-white rounded-xl shadow-sm border">
              <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-lg">Projects</TabsTrigger>
              <TabsTrigger value="education" className="rounded-lg">Education</TabsTrigger>
              <TabsTrigger value="skills" className="rounded-lg">Skills</TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg">Media</TabsTrigger>
              <TabsTrigger value="social" className="rounded-lg">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
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

                {/* Recent Activity */}
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

              {/* Profile Completion */}
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

            <TabsContent value="projects">
              <ProjectsSection 
                profileData={profileData} 
                onUpdate={refreshProfile}
                userId={user?.id}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationSection 
                profileData={profileData} 
                onUpdate={refreshProfile}
                userId={user?.id}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsSection 
                profileData={profileData} 
                onUpdate={refreshProfile}
                userId={user?.id}
              />
            </TabsContent>

            <TabsContent value="media">
              <MediaSection 
                profileData={profileData} 
                onUpdate={refreshProfile}
                userId={user?.id}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinksForm 
                profileData={profileData} 
                onUpdate={refreshProfile}
                userId={user?.id}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <ProfileEditForm
            profileData={profileData}
            onClose={() => setIsEditingProfile(false)}
            onUpdate={refreshProfile}
            userId={user?.id}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
