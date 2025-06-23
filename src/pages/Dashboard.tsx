
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
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userAuditions, setUserAuditions] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching dashboard data for user:', user.id);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        fetchUserEvents(),
        fetchUserAuditions(),
        fetchRegisteredEvents(),
        fetchAuditionApplications()
      ]);

      // Check if any critical operations failed
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some dashboard data failed to load:', failures);
        // Still continue with partial data rather than failing completely
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try refreshing the page.");
      toast({
        title: "Error",
        description: "Some dashboard data may not be available",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      console.log('Fetching user events...');
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date, location, created_at, status")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setUserEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching user events:", error);
      setUserEvents([]);
    }
  };

  const fetchUserAuditions = async () => {
    try {
      console.log('Fetching user auditions...');
      const { data, error } = await supabase
        .from("auditions")
        .select("id, title, status, created_at, location, deadline, description")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setUserAuditions(data || []);
    } catch (error: any) {
      console.error("Error fetching user auditions:", error);
      setUserAuditions([]);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      console.log('Fetching registered events...');
      const { data, error } = await supabase
        .from("event_attendees")
        .select(`
          id,
          attendance_status,
          registered_at,
          event_id,
          events!inner(
            id,
            title,
            event_date,
            location
          )
        `)
        .eq("user_id", user!.id)
        .order('registered_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setRegisteredEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching registered events:", error);
      setRegisteredEvents([]);
    }
  };

  const fetchAuditionApplications = async () => {
    try {
      console.log('Fetching audition applications...');
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
        .eq("artist_id", user!.id)
        .order('application_date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setAuditionApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching audition applications:", error);
      setAuditionApplications([]);
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
              <Button onClick={fetchUserData} className="w-full">
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
            onRefresh={fetchUserData}
          />
          
          <DashboardStats 
            isLoading={isLoading}
            userEvents={userEvents}
            userAuditions={userAuditions}
            registeredEvents={registeredEvents}
            auditionApplications={auditionApplications}
            userRole={profile?.role}
          />
          
          <DashboardTabs 
            isLoading={isLoading}
            userEvents={userEvents}
            userAuditions={userAuditions}
            registeredEvents={registeredEvents}
            auditionApplications={auditionApplications}
            formatDate={formatDate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
