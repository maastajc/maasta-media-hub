
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ExternalLink,
  Download,
  Play,
  FileText
} from "lucide-react";

interface ApplicantDetailsDialogProps {
  applicant: any;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

export const ApplicantDetailsDialog = ({ 
  applicant, 
  isOpen, 
  onClose, 
  formatDate 
}: ApplicantDetailsDialogProps) => {
  const navigate = useNavigate();
  const [artistDetails, setArtistDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && applicant) {
      fetchArtistDetails(applicant.artist_id);
    }
  }, [isOpen, applicant]);

  const fetchArtistDetails = async (artistId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          special_skills (skill),
          projects (project_name, role_in_project, year_of_release),
          education_training (qualification_name, institution, year_completed),
          media_assets (url, file_name, file_type, description, is_video),
          language_skills (language, proficiency)
        `)
        .eq('id', artistId)
        .single();

      if (error) throw error;
      setArtistDetails(data);
    } catch (error) {
      console.error("Error fetching artist details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAsset = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  if (!applicant) return null;

  const profile = applicant.profiles || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile.profile_picture_url || ""} />
              <AvatarFallback>{profile.full_name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            Applicant Details: {profile.full_name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-sm">{profile.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm">
                      {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Location not specified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm">
                      Applied: {formatDate(applicant.application_date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Professional Info</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Category: </span>
                    <Badge variant="secondary">{profile.category || 'Not specified'}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Experience: </span>
                    <Badge variant="secondary">{profile.experience_level || 'Not specified'}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Years of Experience: </span>
                    <span className="text-sm">{profile.years_of_experience || 0} years</span>
                  </div>
                  {profile.willing_to_relocate !== null && (
                    <div>
                      <span className="text-sm font-medium">Willing to Relocate: </span>
                      <Badge variant={profile.willing_to_relocate ? "default" : "secondary"}>
                        {profile.willing_to_relocate ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Application Notes */}
            {applicant.notes && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Application Notes</h3>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">{applicant.notes}</p>
                </div>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Bio</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <Separator />

            {/* Detailed Information (only if loaded) */}
            {!isLoading && artistDetails && (
              <div className="space-y-6">
                {/* Skills */}
                {artistDetails.special_skills && artistDetails.special_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Special Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {artistDetails.special_skills.map((skill: any, index: number) => (
                        <Badge key={index} variant="outline">{skill.skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {artistDetails.language_skills && artistDetails.language_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Languages</h3>
                    <div className="space-y-1">
                      {artistDetails.language_skills.map((lang: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{lang.language}</span> - {lang.proficiency}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {artistDetails.projects && artistDetails.projects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Recent Projects</h3>
                    <div className="space-y-2">
                      {artistDetails.projects.slice(0, 3).map((project: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium">{project.project_name}</div>
                          <div className="text-sm text-gray-600">
                            {project.role_in_project} • {project.year_of_release}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Assets */}
                {artistDetails.media_assets && artistDetails.media_assets.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Portfolio & Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {artistDetails.media_assets.map((asset: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {asset.is_video ? (
                                <Play size={16} className="text-blue-500" />
                              ) : (
                                <FileText size={16} className="text-gray-500" />
                              )}
                              <div>
                                <div className="font-medium text-sm">{asset.file_name}</div>
                                {asset.description && (
                                  <div className="text-xs text-gray-600">{asset.description}</div>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDownloadAsset(asset.url, asset.file_name)}
                              variant="outline"
                              size="sm"
                            >
                              <Download size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-4">
              <Button 
                onClick={() => navigate(`/artist/${applicant.artist_id}`)}
                variant="default"
                className="flex items-center gap-2"
              >
                <User size={16} />
                View Full Profile
              </Button>
              
              {profile.personal_website && (
                <Button 
                  onClick={() => window.open(profile.personal_website, '_blank')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Website
                </Button>
              )}
              
              {profile.linkedin && (
                <Button 
                  onClick={() => window.open(profile.linkedin, '_blank')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  LinkedIn
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
