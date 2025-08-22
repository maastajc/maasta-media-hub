-- Clean up all duplicate and problematic policies
DROP POLICY IF EXISTS "Organization admins can delete memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can delete organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;