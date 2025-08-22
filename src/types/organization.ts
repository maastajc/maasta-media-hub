
export interface Organization {
  id: string;
  name: string;
  category: OrganizationCategory;
  logo_url?: string;
  banner_url?: string;
  about?: string;
  services?: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  instagram?: string;
  linkedin?: string;
  verified: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type OrganizationCategory = 
  | 'production_house'
  | 'media_association'
  | 'college'
  | 'agency'
  | 'studio'
  | 'event_organizer'
  | 'cultural_body'
  | 'union'
  | 'other';

export type OrganizationMemberRole = 'admin' | 'editor' | 'viewer';

export interface OrganizationMember {
  id: string;
  org_id: string;
  user_id: string;
  role: OrganizationMemberRole;
  invited_by?: string;
  joined_at: string;
}

export interface CreateOrganizationData {
  name: string;
  category: OrganizationCategory;
  logo_url?: string;
  banner_url?: string;
  about?: string;
  services?: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  instagram?: string;
  linkedin?: string;
}
