
-- Fix infinite recursion in RLS policies by creating security definer functions

-- Create function to check if user is organization admin/editor
CREATE OR REPLACE FUNCTION public.user_is_org_member_with_role(org_uuid UUID, required_roles organization_member_role[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE org_id = org_uuid 
    AND user_id = auth.uid() 
    AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user is organization admin
CREATE OR REPLACE FUNCTION public.user_is_org_admin(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE org_id = org_uuid 
    AND user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Organization members can update" ON organizations;
DROP POLICY IF EXISTS "Organization admins can delete" ON organizations;
DROP POLICY IF EXISTS "Organization admins can manage members" ON organization_members;

-- Create new policies using security definer functions
CREATE POLICY "Organization members can update" ON organizations
  FOR UPDATE USING (
    public.user_is_org_member_with_role(id, ARRAY['admin', 'editor']::organization_member_role[])
  );

CREATE POLICY "Organization admins can delete" ON organizations
  FOR DELETE USING (public.user_is_org_admin(id));

CREATE POLICY "Organization admins can manage members" ON organization_members
  FOR ALL USING (public.user_is_org_admin(org_id));
