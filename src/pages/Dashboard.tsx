
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { OptimizedDashboardTabs } from "@/components/dashboard/OptimizedDashboardTabs";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    auditionsCount: 0,
    applicationsCount: 0,
    pendingApplicationsCount: 0
  });
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    // Only fetch basic stats initially for faster load
    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching optimized dashboard stats for user:', user.id);
      
      // Fetch only counts for initial load - much faster
      const [auditionsResult, applicationsResult] = await Promise.allSettled([
        supabase
          .from("auditions")
          .select("id", { count: 'exact', head: true })
          .eq("creator_id", user.id),
        supabase
          .from("audition_applications")
          .select("id", { count: 'exact', head: true })
          .eq("artist_id", user.id)
      ]);

      let auditionsCount = 0;
      let applicationsCount = 0;
      let pendingApplicationsCount = 0;

      if (auditionsResult.status === 'fulfilled' && auditionsResult.value.count !== null) {
        auditionsCount = auditionsResult.value.count;
      }

      if (applicationsResult.status === 'fulfilled' && applicationsResult.value.count !== null) {
        applicationsCount = applicationsResult.value.count;
        
        // Get pending applications count
        const pendingResult = await supabase
          .from("audition_applications")
          .select("id", { count: 'exact', head: true })
          .eq("artist_id", user.id)
          .eq("status", "pending");
        
        pendingApplicationsCount = pendingResult.count || 0;
      }

      setDashboardStats({
        auditionsCount,
        applicationsCount,
        pendingApplicationsCount
      });

    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard statistics.");
      toast({
        title: "Error",
        description: "Some dashboard data may not be available",
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

  // If there's a critical error, show error state
  if (error && isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <h2 className="text-xl font-semibold mb-2">Dashboard Unavailable</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchDashboardStats} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader 
            error={error}
            isLoading={isLoading}
            onRefresh={fetchDashboardStats}
          />
          
          <DashboardStats 
            isLoading={isLoading}
            userAuditions={[]} // Will be loaded lazily in tabs
            auditionApplications={[]} // Will be loaded lazily in tabs
            userRole={profile?.role}
            dashboardStats={dashboardStats}
          />
          
          <OptimizedDashboardTabs 
            userId={user.id}
            formatDate={formatDate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
