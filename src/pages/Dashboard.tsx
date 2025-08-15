
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
import { DashboardErrorBoundary } from "@/components/dashboard/DashboardErrorBoundary";
import ProfileStrengthMeter from "@/components/profile/ProfileStrengthMeter";
import { fetchArtistById } from "@/services/artist/artistById";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAuditions, setUserAuditions] = useState<any[]>([]);
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);
  const [userEvents, setUserEvents] = useState<any[]>([]);

  // Fetch artist profile for profile strength meter
  const { data: artistProfile } = useQuery({
    queryKey: ["artistProfile", user?.id],
    queryFn: () => fetchArtistById(user?.id || ""),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
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
      console.log('Fetching dashboard data for user:', user.id, 'with profile role:', profile?.role);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        fetchUserAuditions(),
        fetchAuditionApplications(),
        fetchUserEvents()
      ]);

      // Check if any critical operations failed
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some dashboard data failed to load:', failures);
        failures.forEach((failure, index) => {
          if (failure.status === 'rejected') {
            console.error(`Operation ${index} failed:`, failure.reason);
          }
        });
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

  const fetchUserAuditions = async () => {
    try {
      console.log('Fetching user auditions for creator_id:', user!.id);
      const { data, error } = await supabase
        .from("auditions")
        .select("id, title, status, created_at, location, deadline, description")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching user auditions:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} user auditions`);
      setUserAuditions(data || []);
    } catch (error: any) {
      console.error("Error fetching user auditions:", error);
      setUserAuditions([]);
      throw error; // Re-throw to be caught by Promise.allSettled
    }
  };

  const fetchAuditionApplications = async () => {
    try {
      console.log('Fetching audition applications for artist_id:', user!.id);
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
        
      if (error) {
        console.error('Error fetching audition applications:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} audition applications`);
      setAuditionApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching audition applications:", error);
      setAuditionApplications([]);
      throw error; // Re-throw to be caught by Promise.allSettled
    }
  };

  const fetchUserEvents = async () => {
    try {
      console.log('Fetching user events for creator_id:', user!.id);
      const { data, error } = await supabase
        .from("events")
        .select("id, title, status, created_at, location, event_date, description, category, ticketing_enabled, ticket_price, max_attendees")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching user events:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} user events`);
      setUserEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching user events:", error);
      setUserEvents([]);
      throw error; // Re-throw to be caught by Promise.allSettled
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
    <DashboardErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DashboardHeader 
              error={error}
              isLoading={isLoading}
              onRefresh={fetchUserData}
            />

            {/* Profile Strength Section */}
            {artistProfile && (
              <div className="mb-8">
                <ProfileStrengthMeter 
                  artist={artistProfile} 
                  showActionButton={true}
                  compact={true}
                />
              </div>
            )}
            
            <DashboardStats 
              isLoading={isLoading}
              userAuditions={userAuditions}
              auditionApplications={auditionApplications}
              userEvents={userEvents}
              userRole={profile?.role}
            />
            
            <DashboardTabs 
              isLoading={isLoading}
              userAuditions={userAuditions}
              auditionApplications={auditionApplications}
              userEvents={userEvents}
              formatDate={formatDate}
            />
          </div>
        </main>
        <Footer />
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
