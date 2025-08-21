
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReviewTab } from "@/components/dashboard/ReviewTab";

const MyReview = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Review Applications</h1>
            <p className="text-gray-600">Review and manage applications for your auditions</p>
          </div>
          
          <ReviewTab 
            isLoading={isLoading}
            userAuditions={userAuditions}
            formatDate={formatDate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReview;
