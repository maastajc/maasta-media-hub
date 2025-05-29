
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Camera,
  Video,
  ExternalLink,
  Award,
  Brain,
  Wrench,
  Film,
  ArrowLeft
} from "lucide-react";

const ArtistProfile = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [artistData, setArtistData] = useState<any>(null);

  useEffect(() => {
    if (!artistId) {
      navigate("/");
      return;
    }
    
    const fetchArtistProfile = async () => {
      try {
        setIsLoading(true);
        
        // Fetch artist from artist_details table with all related data
        const { data, error } = await supabase
          .from("artist_details")
          .select(`
            *,
            projects (*),
            education_training (*),
            special_skills (*),
            language_skills (*),
            tools_software (*),
            media_assets (*)
          `)
          .eq("id", artistId)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            toast({
              title: "Artist not found",
              description: "The artist profile you're looking for doesn't exist.",
              variant: "destructive",
            });
            navigate("/artists");
            return;
          }
          throw error;
        }
        
        setArtistData(data);
      } catch (error: any) {
        console.error("Error fetching artist profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load artist profile",
          variant: "destructive",
        });
        navigate("/artists");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistProfile();
  }, [artistId, navigate, toast]);

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

  if (!artistData) {
    return null;
  }

  const socialLinks = [
    { icon: Globe, url: artistData.personal_website, label: 'Website' },
    { icon: Instagram, url: artistData.instagram, label: 'Instagram' },
    { icon: Linkedin, url: artistData.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: artistData.youtube_vimeo, label: 'YouTube/Vimeo' },
    { icon: Film, url: artistData.imdb_profile, label: 'IMDB' },
  ].filter(link => link.url);

  const photos = artistData.media_assets?.filter((asset: any) => !asset.is_video) || [];
  const videos = artistData.media_assets?.filter((asset: any) => asset.is_video) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-maasta-purple via-maasta-orange to-purple-600"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-white p-8">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-gray-500 hover:text-maasta-purple"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                  </Button>

                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Profile Picture */}
                    <Avatar className="w-48 h-48 rounded-2xl shadow-xl border-4 border-white">
                      <AvatarImage 
                        src={artistData.profile_picture_url} 
                        alt={artistData.full_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl font-bold bg-maasta-purple text-white">
                        {artistData.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Main Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">{artistData.full_name}</h1>
                      
                      {artistData.category && (
                        <div className="flex justify-center lg:justify-start mb-4">
                          <Badge className="bg-maasta-purple text-white px-4 py-2 text-lg font-medium rounded-full capitalize">
                            {artistData.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}

                      {(artistData.city || artistData.state || artistData.country) && (
                        <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                          <MapPin size={20} className="mr-2" />
                          <span className="text-lg">
                            {[artistData.city, artistData.state, artistData.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}

                      {artistData.experience_level && (
                        <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                          <Star size={20} className="mr-2" />
                          <span className="text-lg capitalize">
                            {artistData.experience_level} Level
                          </span>
                          {artistData.years_of_experience && (
                            <span className="ml-2">
                              ({artistData.years_of_experience} years)
                            </span>
                          )}
                        </div>
                      )}

                      {artistData.bio && (
                        <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">{artistData.bio}</p>
                      )}

                      {/* Work Preferences */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                        {artistData.work_preference && (
                          <Badge variant="outline" className="capitalize">
                            {artistData.work_preference.replace('_', ' ')}
                          </Badge>
                        )}
                        {artistData.willing_to_relocate && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Willing to Relocate
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
                              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300"
                              title={link.label}
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

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* Projects Section */}
          {artistData.projects && artistData.projects.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Award className="mr-3 text-maasta-orange" size={32} />
                Projects ({artistData.projects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artistData.projects.map((project: any) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-gray-900">{project.project_name}</h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-maasta-orange hover:text-maasta-orange/80"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p><strong>Role:</strong> {project.role_in_project}</p>
                        {project.director_producer && (
                          <p><strong>Director:</strong> {project.director_producer}</p>
                        )}
                        {project.streaming_platform && (
                          <p><strong>Platform:</strong> {project.streaming_platform}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge className="bg-maasta-purple/10 text-maasta-purple border-maasta-purple/20">
                          {project.project_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {project.year_of_release}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Media Portfolio */}
          {(photos.length > 0 || videos.length > 0) && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Camera className="mr-3 text-maasta-purple" size={32} />
                Media Portfolio
              </h2>
              
              {photos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Camera className="mr-2" size={20} />
                    Photos ({photos.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo: any) => (
                      <div key={photo.id} className="aspect-square relative group overflow-hidden rounded-lg">
                        <img
                          src={photo.url}
                          alt={photo.description || photo.file_name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 text-white hover:text-maasta-orange transition-all"
                          >
                            <ExternalLink size={24} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Video className="mr-2" size={20} />
                    Videos ({videos.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video: any) => (
                      <div key={video.id} className="aspect-video relative group overflow-hidden rounded-lg">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Skills & Abilities */}
          {(artistData.special_skills?.length > 0 || artistData.language_skills?.length > 0 || artistData.tools_software?.length > 0) && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Brain className="mr-3 text-green-600" size={32} />
                Skills & Abilities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Special Skills */}
                {artistData.special_skills?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Star className="mr-2 text-maasta-purple" size={20} />
                        Special Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {artistData.special_skills.map((skill: any) => (
                          <Badge key={skill.id} variant="outline">
                            {skill.skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Languages */}
                {artistData.language_skills?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Globe className="mr-2 text-maasta-orange" size={20} />
                        Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {artistData.language_skills.map((lang: any) => (
                          <div key={lang.id} className="flex justify-between items-center">
                            <span>{lang.language}</span>
                            <Badge className="capitalize text-xs">{lang.proficiency}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tools & Software */}
                {artistData.tools_software?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Wrench className="mr-2 text-green-600" size={20} />
                        Tools & Software
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {artistData.tools_software.map((tool: any) => (
                          <Badge key={tool.id} variant="outline">
                            {tool.tool_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          {/* Education & Training */}
          {artistData.education_training && artistData.education_training.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <GraduationCap className="mr-3 text-blue-600" size={32} />
                Education & Training ({artistData.education_training.length})
              </h2>
              <div className="space-y-6">
                {artistData.education_training.map((edu: any) => (
                  <Card key={edu.id}>
                    <CardContent className="p-6">
                      <div className="border-l-4 border-maasta-orange pl-6">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{edu.qualification_name}</h3>
                        {edu.institution && (
                          <p className="text-gray-600 mb-2">{edu.institution}</p>
                        )}
                        <div className="flex items-center gap-3">
                          {edu.year_completed && (
                            <Badge variant="outline">
                              {edu.year_completed}
                            </Badge>
                          )}
                          <Badge 
                            className={edu.is_academic ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                          >
                            {edu.is_academic ? "Academic" : "Professional Training"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
