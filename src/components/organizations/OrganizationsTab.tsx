
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { organizationService } from "@/services/organizationService";
import { Organization, OrganizationMemberRole } from "@/types/organization";
import { OrganizationCard } from "./OrganizationCard";
import { useNavigate } from "react-router-dom";

export const OrganizationsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Array<Organization & { userRole: OrganizationMemberRole }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    }
  }, [user]);

  const fetchOrganizations = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await organizationService.getUserOrganizations(user.id);
      
      // Transform the data to include user role
      const orgsWithRoles = data.map((org: any) => ({
        ...org,
        userRole: org.organization_members[0]?.role || 'viewer'
      }));
      
      setOrganizations(orgsWithRoles);
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (orgId: string) => {
    navigate(`/organizations/${orgId}/edit`);
  };

  const handleViewPage = (orgId: string) => {
    navigate(`/organizations/${orgId}`);
  };

  const handleCreateEvent = (orgId: string) => {
    navigate(`/create-event?organization=${orgId}`);
  };

  const handleCreateAudition = (orgId: string) => {
    navigate(`/create-audition?organization=${orgId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maasta-purple mx-auto mb-4"></div>
          <p>Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Organizations</h2>
          <p className="text-gray-600">Manage your organizations and post as a company</p>
        </div>
        
        <Button 
          onClick={() => navigate('/organizations/create')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Organization
        </Button>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Organizations Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create an organization to host events and auditions as a company, studio, or association.
          </p>
          <Button 
            onClick={() => navigate('/organizations/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Organization
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              userRole={org.userRole}
              onEdit={() => handleEdit(org.id)}
              onViewPage={() => handleViewPage(org.id)}
              onCreateEvent={() => handleCreateEvent(org.id)}
              onCreateAudition={() => handleCreateAudition(org.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
