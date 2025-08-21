
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Organization, OrganizationMemberRole } from "@/types/organization";
import { Building2, ExternalLink, Calendar, Users } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
  userRole: OrganizationMemberRole;
  onEdit: () => void;
  onViewPage: () => void;
  onCreateEvent: () => void;
  onCreateAudition: () => void;
}

const categoryLabels: Record<string, string> = {
  production_house: "Production House",
  media_association: "Media Association",
  college: "College",
  agency: "Agency",
  studio: "Studio",
  event_organizer: "Event Organizer",
  cultural_body: "Cultural Body",
  union: "Union",
  other: "Other"
};

export const OrganizationCard = ({
  organization,
  userRole,
  onEdit,
  onViewPage,
  onCreateEvent,
  onCreateAudition
}: OrganizationCardProps) => {
  const canManage = userRole === 'admin' || userRole === 'editor';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {organization.logo_url ? (
              <img 
                src={organization.logo_url} 
                alt={organization.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{organization.name}</h3>
              {organization.verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {categoryLabels[organization.category]}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Badge variant="outline">{userRole}</Badge>
            </div>

            {organization.about && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {organization.about}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onViewPage}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View Page
              </Button>
              
              {canManage && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCreateEvent}
                    className="flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    Create Event
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCreateAudition}
                    className="flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    Post Audition
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
