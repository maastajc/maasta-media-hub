
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { EventsTab } from "@/components/dashboard/EventsTab";

const MyEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("id, title, status, created_at, location, event_date, description, category, ticketing_enabled, ticket_price, max_attendees")
        .eq("creator_id", user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUserEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching user events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
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
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-gray-600">Manage all your created events</p>
        </div>
        
        <EventsTab 
          isLoading={isLoading}
          userEvents={userEvents}
          formatDate={formatDate}
          onEventDeleted={fetchUserEvents}
        />
      </div>
    </ProfileLayout>
  );
};

export default MyEvents;
