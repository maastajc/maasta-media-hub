
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organizationService } from "@/services/organizationService";
import { Organization } from "@/types/organization";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Linkedin,
  MapPin,
  Users,
  Loader2
} from "lucide-react";

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

const OrganizationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const data = await organizationService.getOrganization(id);
      if (data) {
        setOrganization(data);
      } else {
        setError("Organization not found");
      }
    } catch (error: any) {
      console.error('Error fetching organization:', error);
      setError("Failed to load organization");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h1>
          <p className="text-gray-600">{error || "The organization you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {organization.banner_url ? (
          <img 
            src={organization.banner_url} 
            alt={`${organization.name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                {organization.logo_url ? (
                  <img 
                    src={organization.logo_url} 
                    alt={organization.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white sm:text-gray-900 truncate">
                  {organization.name}
                </h1>
                {organization.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-lg text-gray-200 sm:text-gray-600 mb-4">
                {categoryLabels[organization.category]}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {organization.about && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {organization.about}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Services Section */}
            {organization.services && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Services</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {organization.services}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a 
                      href={`mailto:${organization.contact_email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {organization.contact_email}
                    </a>
                  </div>
                  
                  {organization.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a 
                        href={`tel:${organization.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {organization.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            {(organization.website || organization.instagram || organization.linkedin) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Links</h3>
                  <div className="space-y-3">
                    {organization.website && (
                      <a 
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:underline"
                      >
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        Website
                      </a>
                    )}
                    
                    {organization.instagram && (
                      <a 
                        href={`https://instagram.com/${organization.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:underline"
                      >
                        <Instagram className="w-4 h-4 flex-shrink-0" />
                        Instagram
                      </a>
                    )}
                    
                    {organization.linkedin && (
                      <a 
                        href={`https://linkedin.com/${organization.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-4 h-4 flex-shrink-0" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organization Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Organization Info</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{categoryLabels[organization.category]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {organization.verified && (
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
