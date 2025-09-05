
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuditionsTab } from "@/components/dashboard/AuditionsTab";

const MyAuditions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userAuditions, setUserAuditions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserAuditions();
    }
  }, [user]);

  const fetchUserAuditions = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("auditions")
        .select("id, title, status, created_at, location, deadline, description")
        .eq("creator_id", user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUserAuditions(data || []);
    } catch (error: any) {
      console.error("Error fetching user auditions:", error);
      toast({
        title: "Error",
        description: "Failed to load auditions",
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Auditions</h1>
          <p className="text-gray-600">Manage all your posted auditions</p>
        </div>
        
        <AuditionsTab 
          isLoading={isLoading}
          userAuditions={userAuditions}
          formatDate={formatDate}
          onAuditionDeleted={fetchUserAuditions}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MyAuditions;
