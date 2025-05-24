
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Globe, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Calendar,
  Star,
  Award,
  BookOpen,
  Users,
  Briefcase,
  Mail,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ArtistProfileData {
  id: string;
  full_name: string;
  bio: string;
  profile_picture_url: string;
  city: string;
  state: string;
  country: string;
  instagram: string;
  linkedin: string;
  youtube_vimeo: string;
  personal_website: string;
  imdb_profile: string;
  role: string;
  status: string;
  artist_details?: {
    category: string;
    experience_level: string;
    years_of_experience: number;
    association_membership: string;
  } | null;
  projects?: Array<{
    id: string;
    project_name: string;
    project_type: string;
    role_in_project: string;
    year_of_release: number;
    director_producer: string;
    streaming_platform: string;
    link: string;
  }> | null;
  education_training?: Array<{
    id: string;
    qualification_name: string;
    institution: string;
    year_completed: number;
    is_academic: boolean;
  }> | null;
  special_skills?: Array<{
    id: string;
    skill: string;
  }> | null;
  language_skills?: Array<{
    id: string;
    language: string;
    proficiency: string;
  }> | null;
  tools_software?: Array<{
    id: string;
    tool_name: string;
  }> | null;
  media_assets?: Array<{
    id: string;
    url: string;
    file_name: string;
    file_type: string;
    is_video: boolean;
    description: string;
  }> | null;
}

const ArtistProfile = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<ArtistProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!artistId) {
        toast.error("Artist ID not provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch the artist profile with all related data
        const { data, error } = await supabase
          .from('profiles')
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
          .eq('id', artistId)
          .eq('role', 'artist')
          .single();

        if (error) {
          console.error("Error fetching artist profile:", error);
          toast.error("Failed to load artist profile");
          return;
        }

        if (data) {
          // Safely handle the data conversion
          const artistData: ArtistProfileData = {
            ...data,
            artist_details: Array.isArray(data.artist_details) && data.artist_details.length > 0 
              ? data.artist_details[0] 
              : null,
            projects: Array.isArray(data.projects) ? data.projects : null,
            education_training: Array.isArray(data.education_training) ? data.education_training : null,
            special_skills: Array.isArray(data.special_skills) ? data.special_skills : null,
            language_skills: Array.isArray(data.language_skills) ? data.language_skills : null,
            tools_software: Array.isArray(data.tools_software) ? data.tools_software : null,
            media_assets: Array.isArray(data.media_assets) ? data.media_assets : null,
          };
          setArtist(artistData);
        } else {
          toast.error("Artist not found");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Failed to load artist profile");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistProfile();
  }, [artistId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="relative">
            <Skeleton className="h-80 w-full" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8">
                <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                <Skeleton className="h-8 w-64 mx-auto mt-4" />
                <Skeleton className="h-6 w-48 mx-auto mt-2" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-lg font-medium mb-1">Artist not found</h3>
              <p className="text-gray-500">The artist profile you're looking for doesn't exist.</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const socialLinks = [
    { icon: Globe, url: artist.personal_website, label: 'Website' },
    { icon: Instagram, url: artist.instagram, label: 'Instagram' },
    { icon: Linkedin, url: artist.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: artist.youtube_vimeo, label: 'YouTube/Vimeo' },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Cover */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-r from-maasta-purple via-maasta-orange to-purple-600"></div>
          
          {/* Profile Card Overlay */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <Card className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-white p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    
                    {/* Profile Picture */}
                    <div className="relative">
                      <img
                        src={artist.profile_picture_url || '/placeholder.svg'}
                        alt={artist.full_name}
                        className="w-48 h-48 rounded-2xl object-cover shadow-xl border-4 border-white"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{artist.full_name}</h1>
                      
                      {artist.artist_details?.category && (
                        <div className="flex justify-center lg:justify-start mb-4">
                          <Badge className="bg-maasta-purple text-white px-4 py-2 text-lg font-medium rounded-full">
                            {artist.artist_details.category}
                          </Badge>
                        </div>
                      )}

                      {(artist.city || artist.state || artist.country) && (
                        <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                          <MapPin size={20} className="mr-2" />
                          <span className="text-lg">
                            {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}

                      {artist.artist_details && (
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                          {artist.artist_details.experience_level && (
                            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                              <Star className="w-5 h-5 mr-2 text-maasta-orange" />
                              <span className="font-medium capitalize">{artist.artist_details.experience_level}</span>
                            </div>
                          )}
                          {artist.artist_details.years_of_experience && (
                            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                              <Calendar className="w-5 h-5 mr-2 text-maasta-purple" />
                              <span className="font-medium">{artist.artist_details.years_of_experience} years</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <Button className="bg-maasta-orange hover:bg-maasta-orange/90 text-white px-8 py-3 rounded-full font-medium">
                          <Mail className="w-5 h-5 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium">
                          <Download className="w-5 h-5 mr-2" />
                          Portfolio
                        </Button>
                      </div>
                    </div>

                    {/* Social Links Sidebar */}
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
                              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-maasta-purple hover:text-white transition-all duration-300 group"
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          {/* About Section */}
          {artist.bio && (
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="mr-3 text-maasta-purple" size={24} />
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{artist.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Projects Showcase */}
          {artist.projects && artist.projects.length > 0 && (
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Briefcase className="mr-3 text-maasta-purple" size={24} />
                  Featured Projects ({artist.projects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artist.projects.map((project) => (
                    <div key={project.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-maasta-purple transition-colors">
                          {project.project_name}
                        </h3>
                        {project.year_of_release && (
                          <Badge variant="outline" className="bg-white">
                            {project.year_of_release}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          <span className="font-medium">Role:</span>
                          <span className="ml-1">{project.role_in_project}</span>
                        </div>
                        
                        {project.director_producer && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="font-medium">Director:</span>
                            <span className="ml-1">{project.director_producer}</span>
                          </div>
                        )}
                        
                        {project.streaming_platform && (
                          <div className="flex items-center text-gray-600">
                            <Eye className="w-4 h-4 mr-2" />
                            <span className="font-medium">Platform:</span>
                            <span className="ml-1">{project.streaming_platform}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Badge className="bg-maasta-purple/10 text-maasta-purple border-maasta-purple/20">
                          {project.project_type}
                        </Badge>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-maasta-orange hover:text-maasta-orange/80 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills & Expertise Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Special Skills */}
            {artist.special_skills && artist.special_skills.length > 0 && (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Star className="mr-3 text-maasta-orange" size={20} />
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {artist.special_skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        className="bg-gradient-to-r from-maasta-purple to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
                      >
                        {skill.skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {artist.language_skills && artist.language_skills.length > 0 && (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Languages</h3>
                  <div className="space-y-4">
                    {artist.language_skills.map((lang) => (
                      <div key={lang.id} className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{lang.language}</span>
                        <Badge 
                          variant="outline" 
                          className="capitalize bg-gray-50 border-gray-200"
                        >
                          {lang.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Education & Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Education */}
            {artist.education_training && artist.education_training.length > 0 && (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <BookOpen className="mr-3 text-maasta-purple" size={20} />
                    Education & Training
                  </h3>
                  <div className="space-y-6">
                    {artist.education_training.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-maasta-orange pl-6 pb-4">
                        <h4 className="font-bold text-gray-900 text-lg">{edu.qualification_name}</h4>
                        {edu.institution && (
                          <p className="text-gray-600 mb-2">{edu.institution}</p>
                        )}
                        <div className="flex items-center gap-3">
                          {edu.year_completed && (
                            <Badge variant="outline" className="bg-white">
                              {edu.year_completed}
                            </Badge>
                          )}
                          <Badge 
                            className={edu.is_academic ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                          >
                            {edu.is_academic ? "Academic" : "Professional"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tools & Software */}
            {artist.tools_software && artist.tools_software.length > 0 && (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Tools & Software</h3>
                  <div className="flex flex-wrap gap-3">
                    {artist.tools_software.map((tool) => (
                      <Badge 
                        key={tool.id} 
                        variant="outline"
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 px-4 py-2 rounded-full hover:shadow-md transition-all"
                      >
                        {tool.tool_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Media Gallery */}
          {artist.media_assets && artist.media_assets.length > 0 && (
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Portfolio Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artist.media_assets.map((media) => (
                    <div key={media.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300">
                      {media.is_video ? (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          controls
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt={media.description || media.file_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
