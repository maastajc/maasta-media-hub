-- First drop ALL existing policies on organization_members to start fresh
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can delete memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Public can view organization members" ON public.organization_members;

-- Also drop the problematic organization policies and recreate them properly
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Organization admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization admins can delete organizations" ON public.organizations;

-- Create security definer function to check org admin status
CREATE OR REPLACE FUNCTION public.user_is_org_admin(org_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = org_uuid 
    AND user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Create helper function for organization membership with specific roles
CREATE OR REPLACE FUNCTION public.user_is_org_member_with_role(org_uuid uuid, required_roles organization_member_role[])
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = org_uuid 
    AND user_id = auth.uid() 
    AND role = ANY(required_roles)
  );
END;
$$;

-- Simple non-recursive policies for organization_members
CREATE POLICY "Users can view their own memberships" 
ON public.organization_members 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert organization memberships" 
ON public.organization_members 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Public can view organization members" 
ON public.organization_members 
FOR SELECT 
USING (true);

CREATE POLICY "Organization admins can manage members" 
ON public.organization_members 
FOR ALL 
TO authenticated 
USING (user_is_org_admin(org_id));

-- Fix organization policies using the security definer functions
CREATE POLICY "Everyone can view organizations" 
ON public.organizations 
FOR SELECT 
USING (true);

CREATE POLICY "Organization members can update" 
ON public.organizations 
FOR UPDATE 
TO authenticated 
USING (user_is_org_member_with_role(id, ARRAY['admin', 'editor']::organization_member_role[]));

CREATE POLICY "Organization admins can delete" 
ON public.organizations 
FOR DELETE 
TO authenticated 
USING (user_is_org_admin(id));