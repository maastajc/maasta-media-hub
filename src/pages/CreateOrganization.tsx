
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { organizationService } from "@/services/organizationService";
import { uploadSingleFile } from "@/utils/fileUpload";
import { CreateOrganizationData, OrganizationCategory } from "@/types/organization";
import { ArrowLeft } from "lucide-react";

const categoryOptions: { value: OrganizationCategory; label: string }[] = [
  { value: 'production_house', label: 'Production House' },
  { value: 'media_association', label: 'Media Association' },
  { value: 'college', label: 'College' },
  { value: 'agency', label: 'Agency' },
  { value: 'studio', label: 'Studio' },
  { value: 'event_organizer', label: 'Event Organizer' },
  { value: 'cultural_body', label: 'Cultural Body' },
  { value: 'union', label: 'Union' },
  { value: 'other', label: 'Other' },
];

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [formData, setFormData] = useState<CreateOrganizationData>({
    name: '',
    category: 'other',
    contact_email: '',
    about: '',
    services: '',
    website: '',
    contact_phone: '',
    instagram: '',
    linkedin: ''
  });

  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleBannerUpload = (file: File) => {
    setBannerFile(file);
    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview('');
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
      setBannerPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contact_email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let logoUrl = '';
      let bannerUrl = '';

      // Upload logo if provided
      if (logoFile) {
        const logoResult = await uploadSingleFile(logoFile, 'org-assets/logos');
        logoUrl = logoResult.url;
      }

      // Upload banner if provided
      if (bannerFile) {
        const bannerResult = await uploadSingleFile(bannerFile, 'org-assets/banners');
        bannerUrl = bannerResult.url;
      }

      // Create organization with uploaded images
      const organizationData = {
        ...formData,
        logo_url: logoUrl,
        banner_url: bannerUrl
      };

      const newOrganization = await organizationService.createOrganization(organizationData);
      
      toast({
        title: "Success",
        description: "Organization created successfully!"
      });
      
      // Redirect to the organization profile page
      navigate(`/organizations/${newOrganization.id}`);
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-organizations')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
          </Button>
          <h1 className="text-3xl font-bold">Create Organization</h1>
          <p className="text-gray-600">Set up your organization profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo and Banner Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <p className="text-sm text-gray-500 mb-2">Upload your organization's logo (recommended: square image)</p>
                <FileUpload
                  onFileUpload={handleLogoUpload}
                  acceptedTypes="image/*"
                  maxSizeMB={5}
                  previewUrl={logoPreview}
                  onRemove={removeLogo}
                  buttonText="Upload Logo"
                />
              </div>
              
              <div>
                <Label htmlFor="banner">Cover Image</Label>
                <p className="text-sm text-gray-500 mb-2">Upload a cover image for your organization (recommended: 16:9 aspect ratio)</p>
                <FileUpload
                  onFileUpload={handleBannerUpload}
                  acceptedTypes="image/*"
                  maxSizeMB={10}
                  previewUrl={bannerPreview}
                  onRemove={removeBanner}
                  buttonText="Upload Cover Image"
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: OrganizationCategory) => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  placeholder="Tell us about your organization..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="services">Services Offered</Label>
                <Textarea
                  id="services"  
                  value={formData.services}
                  onChange={(e) => setFormData(prev => ({ ...prev, services: e.target.value }))}
                  placeholder="What services do you provide?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="organization@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links & Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Links & Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@your_organization"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="company/your-organization"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-organizations')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganization;
