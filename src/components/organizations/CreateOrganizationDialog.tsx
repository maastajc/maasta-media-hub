
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { organizationService } from "@/services/organizationService";
import { CreateOrganizationData, OrganizationCategory } from "@/types/organization";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

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

export const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  onSuccess
}: CreateOrganizationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
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
  const { toast } = useToast();

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
      await organizationService.createOrganization(formData);
      
      toast({
        title: "Success",
        description: "Organization created successfully!"
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Description</h3>
            
            <div>
              <Label htmlFor="about">About Us</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                placeholder="Tell us about your organization..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="services">Services Offered</Label>
              <Textarea
                id="services"
                value={formData.services}
                onChange={(e) => setFormData(prev => ({ ...prev, services: e.target.value }))}
                placeholder="What services do you provide?"
                rows={2}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Links & Social Media</h3>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
