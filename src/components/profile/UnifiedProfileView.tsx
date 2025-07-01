import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Film,
  Calendar,
  MapPin,
  Star,
  Award,
  GraduationCap,
  Languages,
  Wrench,
  ExternalLink,
  Play,
  Edit
} from "lucide-react";
import { Artist } from "@/types/artist";
import React from "react";

interface UnifiedProfileViewProps {
  artist: Artist;
  isOwnProfile?: boolean;
  onEditSection?: (section: string) => void;
}

const UnifiedProfileView = ({ artist, isOwnProfile = false, onEditSection }: UnifiedProfileViewProps) => {
  // Keep console logs for debugging but remove the visual debug section
  React.useEffect(() => {
    console.log("[UnifiedProfileView] artist received:", artist);
    if (artist) {
      console.log("Skills:", artist.special_skills);
      console.log("Projects:", artist.projects);
      console.log("Education:", artist.education_training);
      console.log("Media:", artist.media_assets);
      console.log("Languages:", artist.language_skills);
      console.log("Tools:", artist.tools_software);
    }
  }, [artist]);

  const socialLinks = [
    { icon: Globe, url: artist.personal_website, label: 'Website' },
    { icon: Instagram, url: artist.instagram, label: 'Instagram' },
    { icon: Linkedin, url: artist.linkedin, label: 'LinkedIn' },
    { icon: Youtube, url: artist.youtube_vimeo, label: 'YouTube/Vimeo' },
    { icon: Film, url: artist.imdb_profile, label: 'IMDB' },
  ].filter(link => link.url);

  const handleEditClick = (section: string) => {
    if (onEditSection) {
      onEditSection(section);
    }
  };

  const renderMediaSection = () => {
    const mediaAssets = artist.media_assets || [];
    const videos = mediaAssets.filter(asset => asset.is_video);
    const images = mediaAssets.filter(asset => !asset.is_video);

    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-maasta-purple" />
            Portfolio
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('portfolio')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {mediaAssets.length === 0 ? (
            <div className="italic text-gray-400">No portfolio media uploaded.</div>
          ) : (
            <>
              {videos.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Videos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div key={video.id} className="relative">
                        {video.is_embed ? (
                          <div className="aspect-video">
                            <iframe
                              src={video.url}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                              title={video.description || video.file_name}
                            />
                          </div>
                        ) : (
                          <video
                            src={video.url}
                            controls
                            className="w-full aspect-video rounded-lg object-cover"
                            title={video.description || video.file_name}
                          />
                        )}
                        {video.description && (
                          <p className="text-sm text-gray-600 mt-2">{video.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="group">
                        <img
                          src={image.url}
                          alt={image.description || image.file_name}
                          className="w-full aspect-square object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                        />
                        {image.description && (
                          <p className="text-xs text-gray-600 mt-1 truncate">{image.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPortfolioLinks = () => {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-maasta-purple" />
            Portfolio Links
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('portfolio-links')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <div className="italic text-gray-400">No portfolio links provided.</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-maasta-purple hover:text-white rounded-lg transition-colors"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.label}</span>
                    <ExternalLink size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderProjects = () => {
    const projects = artist.projects || [];
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-maasta-purple" />
            Projects
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('projects')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="italic text-gray-400">No projects listed.</div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 border-maasta-orange pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.project_name}</h4>
                      <p className="text-maasta-purple font-medium">{project.role_in_project}</p>
                      {project.director_producer && (
                        <p className="text-gray-600">Director/Producer: {project.director_producer}</p>
                      )}
                      {project.streaming_platform && (
                        <p className="text-gray-600">Platform: {project.streaming_platform}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="outline" className="mb-2">
                        {project.project_type?.replace('_', ' ')}
                      </Badge>
                      {project.year_of_release && (
                        <p className="text-sm text-gray-500">{project.year_of_release}</p>
                      )}
                    </div>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
                    >
                      View Project <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSkills = () => {
    const skills = artist.special_skills || [];
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-maasta-purple" />
            Skills
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('skills')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="italic text-gray-400">No skills added.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                  {skill.skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEducation = () => {
    const education = artist.education_training || [];
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-maasta-purple" />
            Education & Training
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('education')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {education.length === 0 ? (
            <div className="italic text-gray-400">No education or training listed.</div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{edu.qualification_name}</h4>
                    {edu.institution && (
                      <p className="text-gray-600">{edu.institution}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1">
                      {edu.year_completed && (
                        <span className="text-sm text-gray-500">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {edu.year_completed}
                        </span>
                      )}
                      <Badge variant={edu.is_academic ? "default" : "secondary"} className="text-xs">
                        {edu.is_academic ? "Academic" : "Professional"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderLanguages = () => {
    const languages = artist.language_skills || [];
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-maasta-purple" />
            Languages
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('languages')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {languages.length === 0 ? (
            <div className="italic text-gray-400">No language skills provided.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{lang.language}</span>
                  <Badge variant="outline" className="capitalize">
                    {lang.proficiency}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTools = () => {
    const tools = artist.tools_software || [];
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-maasta-purple" />
            Tools & Software
            {isOwnProfile && <Edit className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick('tools')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <div className="italic text-gray-400">No tools or software listed.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Badge key={tool.id} variant="outline" className="px-3 py-1">
                  {tool.tool_name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-0">
      {renderMediaSection()}
      {renderPortfolioLinks()}
      {renderProjects()}
      {renderSkills()}
      {renderEducation()}
      {renderLanguages()}
      {renderTools()}
    </div>
  );
};

export default UnifiedProfileView;
