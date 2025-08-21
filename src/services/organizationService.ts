
import { supabase } from "@/integrations/supabase/client";
import { CreateOrganizationData, Organization, OrganizationMember } from "@/types/organization";

export const organizationService = {
  // Get user's organizations
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        organization_members!inner(role)
      `)
      .eq('organization_members.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new organization
  async createOrganization(organizationData: CreateOrganizationData): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        ...organizationData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update organization
  async updateOrganization(id: string, updates: Partial<CreateOrganizationData>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get organization by ID
  async getOrganization(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get organization members
  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        *,
        profiles!organization_members_user_id_fkey(full_name, email, profile_picture_url)
      `)
      .eq('org_id', orgId);

    if (error) throw error;
    return data || [];
  },

  // Delete organization
  async deleteOrganization(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
