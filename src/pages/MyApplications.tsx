
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { ApplicationsTab } from "@/components/dashboard/ApplicationsTab";

const MyApplications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAuditionApplications();
    }
  }, [user]);

  const fetchAuditionApplications = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("audition_applications")
        .select(`
          id,
          status,
          application_date,
          audition_id,
          notes,
          auditions!inner(
            id,
            title,
            location
          )
        `)
        .eq("artist_id", user.id)
        .order('application_date', { ascending: false });
        
      if (error) throw error;
      setAuditionApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching audition applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProfileLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-600">Track all your audition applications</p>
        </div>
        
        <ApplicationsTab 
          isLoading={isLoading}
          auditionApplications={auditionApplications}
          formatDate={formatDate}
        />
      </div>
    </ProfileLayout>
  );
};

export default MyApplications;
