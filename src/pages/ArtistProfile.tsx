
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Briefcase
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
  };
  projects?: Array<{
    id: string;
    project_name: string;
    project_type: string;
    role_in_project: string;
    year_of_release: number;
    director_producer: string;
    streaming_platform: string;
    link: string;
  }>;
  education_training?: Array<{
    id: string;
    qualification_name: string;
    institution: string;
    year_completed: number;
    is_academic: boolean;
  }>;
  special_skills?: Array<{
    id: string;
    skill: string;
  }>;
  language_skills?: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  tools_software?: Array<{
    id: string;
    tool_name: string;
  }>;
  media_assets?: Array<{
    id: string;
    url: string;
    file_name: string;
    file_type: string;
    is_video: boolean;
    description: string;
  }>;
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
          setArtist(data as ArtistProfileData);
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
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4 mt-4" />
                  <Skeleton className="h-6 w-1/2 mt-2" />
                </div>
                <div className="lg:col-span-2">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          </section>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <img
                        src={artist.profile_picture_url || '/placeholder.svg'}
                        alt={artist.full_name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <h1 className="text-2xl font-bold">{artist.full_name}</h1>
                      {artist.artist_details?.category && (
                        <p className="text-maasta-purple font-medium capitalize">
                          {artist.artist_details.category}
                        </p>
                      )}
                      {(artist.city || artist.state || artist.country) && (
                        <div className="flex items-center justify-center text-gray-500 mt-2">
                          <MapPin size={16} className="mr-1" />
                          <span>
                            {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {artist.artist_details && (
                      <div className="space-y-3 mb-6">
                        {artist.artist_details.experience_level && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience:</span>
                            <Badge variant="secondary" className="capitalize">
                              {artist.artist_details.experience_level}
                            </Badge>
                          </div>
                        )}
                        {artist.artist_details.years_of_experience && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Years:</span>
                            <span className="font-medium">{artist.artist_details.years_of_experience}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {socialLinks.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Connect</h3>
                        <div className="space-y-2">
                          {socialLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-gray-600 hover:text-maasta-purple transition-colors"
                              >
                                <Icon size={16} className="mr-2" />
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-6 bg-maasta-orange hover:bg-maasta-orange/90">
                      Contact Artist
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio Section */}
                {artist.bio && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2" size={20} />
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Projects Section */}
                {artist.projects && artist.projects.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="mr-2" size={20} />
                        Projects ({artist.projects.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {artist.projects.map((project) => (
                          <div key={project.id} className="border-l-4 border-maasta-purple pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{project.project_name}</h4>
                              {project.year_of_release && (
                                <Badge variant="outline">{project.year_of_release}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Role:</span> {project.role_in_project}
                            </p>
                            {project.director_producer && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Director/Producer:</span> {project.director_producer}
                              </p>
                            )}
                            {project.streaming_platform && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Platform:</span> {project.streaming_platform}
                              </p>
                            )}
                            <Badge variant="secondary" className="capitalize">
                              {project.project_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Skills Section */}
                {artist.special_skills && artist.special_skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="mr-2" size={20} />
                        Special Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {artist.special_skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Languages Section */}
                {artist.language_skills && artist.language_skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {artist.language_skills.map((lang) => (
                          <div key={lang.id} className="flex justify-between">
                            <span>{lang.language}</span>
                            <Badge variant="outline" className="capitalize">
                              {lang.proficiency}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Education Section */}
                {artist.education_training && artist.education_training.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2" size={20} />
                        Education & Training
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {artist.education_training.map((edu) => (
                          <div key={edu.id} className="border-l-4 border-maasta-orange pl-4">
                            <h4 className="font-medium">{edu.qualification_name}</h4>
                            {edu.institution && (
                              <p className="text-sm text-gray-600">{edu.institution}</p>
                            )}
                            <div className="flex items-center mt-1">
                              {edu.year_completed && (
                                <Badge variant="outline" className="mr-2">
                                  {edu.year_completed}
                                </Badge>
                              )}
                              <Badge variant={edu.is_academic ? "default" : "secondary"}>
                                {edu.is_academic ? "Academic" : "Professional Training"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tools & Software Section */}
                {artist.tools_software && artist.tools_software.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tools & Software</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {artist.tools_software.map((tool) => (
                          <Badge key={tool.id} variant="outline">
                            {tool.tool_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Media Gallery Section */}
                {artist.media_assets && artist.media_assets.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {artist.media_assets.map((media) => (
                          <div key={media.id} className="aspect-square rounded-lg overflow-hidden">
                            {media.is_video ? (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            ) : (
                              <img
                                src={media.url}
                                alt={media.description || media.file_name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
