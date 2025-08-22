-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Users can view organization memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can update memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can delete memberships" ON public.organization_members;

-- Create simple non-recursive policies for organization_members
CREATE POLICY "Users can view their own memberships" 
ON public.organization_members 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Allow users to insert their own memberships
CREATE POLICY "Users can insert their own memberships" 
ON public.organization_members 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

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

-- Allow organization admins to manage members using the function
CREATE POLICY "Organization admins can manage members" 
ON public.organization_members 
FOR ALL 
TO authenticated 
USING (user_is_org_admin(org_id));

-- Also allow public viewing of organization members
CREATE POLICY "Public can view organization members" 
ON public.organization_members 
FOR SELECT 
USING (true);