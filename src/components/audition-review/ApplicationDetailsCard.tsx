
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Globe,
  Linkedin,
  Youtube,
  User,
  Copy
} from "lucide-react";
import { AuditionApplication } from "@/services/auditionApplicationService";
import { useToast } from "@/hooks/use-toast";

interface ApplicationDetailsCardProps {
  application: AuditionApplication;
}

export const ApplicationDetailsCard = ({ application }: ApplicationDetailsCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={application.artist?.profile_picture_url || ""} 
                alt={application.artist?.full_name || "Artist"}
              />
              <AvatarFallback className="text-xl">
                {application.artist?.full_name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                {application.artist?.full_name || 'Unknown Artist'}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getStatusColor(application.status)} text-xs px-3 py-1`}>
                  {application.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  Applied: {formatDate(application.application_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-semibold mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <span className="flex-1">{application.artist?.email}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(application.artist?.email || '', 'Email')}
              >
                <Copy size={14} />
              </Button>
            </div>
            
            {application.artist?.phone_number && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <span className="flex-1 font-medium">Mobile: {application.artist.phone_number}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(application.artist?.phone_number || '', 'Mobile number')}
                >
                  <Copy size={14} />
                </Button>
              </div>
            )}
            
            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <p className="capitalize">{application.artist?.category?.replace('_', ' ') || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Experience:</span>
                <p className="capitalize">{application.artist?.experience_level || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Links */}
        {(application.artist?.personal_website || application.artist?.linkedin || application.artist?.youtube_vimeo) && (
          <div>
            <h3 className="font-semibold mb-3">Portfolio & Links</h3>
            <div className="space-y-2">
              {application.artist?.personal_website && (
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-500" />
                  <a 
                    href={application.artist.personal_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Personal Website
                  </a>
                </div>
              )}
              
              {application.artist?.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin size={16} className="text-gray-500" />
                  <a 
                    href={application.artist.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              
              {application.artist?.youtube_vimeo && (
                <div className="flex items-center gap-3">
                  <Youtube size={16} className="text-gray-500" />
                  <a 
                    href={application.artist.youtube_vimeo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Video Reel
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Notes */}
        {application.notes && (
          <div>
            <h3 className="font-semibold mb-3">Application Notes</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">{application.notes}</p>
            </div>
          </div>
        )}

        {/* Organizer Notes */}
        {application.organizer_notes && (
          <div>
            <h3 className="font-semibold mb-3">Your Previous Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{application.organizer_notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
