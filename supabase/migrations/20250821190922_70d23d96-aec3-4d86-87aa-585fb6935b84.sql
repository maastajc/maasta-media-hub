
-- Create enum types for organization categories and member roles
CREATE TYPE organization_category AS ENUM (
  'production_house',
  'media_association', 
  'college',
  'agency',
  'studio',
  'event_organizer',
  'cultural_body',
  'union',
  'other'
);

CREATE TYPE organization_member_role AS ENUM (
  'admin',
  'editor', 
  'viewer'
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category organization_category NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  about TEXT,
  mission TEXT,
  services TEXT,
  website TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  instagram TEXT,
  linkedin TEXT,
  verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organization_members table
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role organization_member_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Add organization references to existing events table
ALTER TABLE public.events ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- Add organization references to existing auditions table  
ALTER TABLE public.auditions ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- Enable RLS on organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Public can view organizations" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Organization members can update" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE org_id = organizations.id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Organization admins can delete" ON organizations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE org_id = organizations.id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on organization_members table
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization_members
CREATE POLICY "Public can view organization members" ON organization_members
  FOR SELECT USING (true);

CREATE POLICY "Organization admins can manage members" ON organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om 
      WHERE om.org_id = organization_members.org_id 
      AND om.user_id = auth.uid() 
      AND om.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own memberships" ON organization_members
  FOR SELECT USING (auth.uid() = user_id);

-- Create updated_at trigger for organizations
CREATE OR REPLACE FUNCTION update_organizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_organizations_updated_at();

-- Insert creator as admin when organization is created
CREATE OR REPLACE FUNCTION add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organization_members (org_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_creator_as_admin_trigger
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION add_creator_as_admin();
