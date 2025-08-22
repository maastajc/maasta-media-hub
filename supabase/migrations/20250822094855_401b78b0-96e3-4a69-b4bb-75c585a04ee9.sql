-- Enable RLS on organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on organization_members table  
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create organizations
CREATE POLICY "Users can create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

-- Allow users to view organizations they are members of
CREATE POLICY "Users can view organizations they belong to" 
ON public.organizations 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = organizations.id 
    AND user_id = auth.uid()
  )
);

-- Allow organization admins to update their organizations
CREATE POLICY "Organization admins can update organizations" 
ON public.organizations 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = organizations.id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow organization admins to delete their organizations
CREATE POLICY "Organization admins can delete organizations" 
ON public.organizations 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = organizations.id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow authenticated users to join as organization members (handled by trigger)
CREATE POLICY "Users can insert organization memberships" 
ON public.organization_members 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to view organization memberships for organizations they belong to
CREATE POLICY "Users can view organization memberships" 
ON public.organization_members 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om 
    WHERE om.org_id = organization_members.org_id 
    AND om.user_id = auth.uid()
  )
);

-- Allow organization admins to update memberships
CREATE POLICY "Organization admins can update memberships" 
ON public.organization_members 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = organization_members.org_id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow organization admins to delete memberships
CREATE POLICY "Organization admins can delete memberships" 
ON public.organization_members 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = organization_members.org_id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);