
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

interface UserEvent {
  id: string;
  ticket_id: string;
  status: string;
  joined_at: string;
  event: {
    id: string;
    title: string;
    date_start: string;
    location: string;
    is_online: boolean;
    ticket_type: string;
    ticket_price: number | null;
  };
}

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("event_registrations")
          .select(`
            id,
            ticket_id,
            status,
            joined_at,
            events:event_id (
              id,
              title,
              date_start,
              location,
              is_online,
              ticket_type,
              ticket_price
            )
          `)
          .eq("user_id", user.id)
          .order("joined_at", { ascending: false });

        if (error) throw error;

        const formattedData = data?.map(item => ({
          id: item.id,
          ticket_id: item.ticket_id,
          status: item.status,
          joined_at: item.joined_at,
          event: Array.isArray(item.events) ? item.events[0] : item.events
        })).filter(item => item.event) || [];

        setUserEvents(formattedData);
      } catch (error: any) {
        console.error("Error fetching user events:", error);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from("event_registrations")
        .update({ status: "cancelled" })
        .eq("id", registrationId);

      if (error) throw error;

      setUserEvents(prev => 
        prev.map(event => 
          event.id === registrationId 
            ? { ...event, status: "cancelled" }
            : event
        )
      );

      toast.success("Registration cancelled successfully");
    } catch (error: any) {
      console.error("Error cancelling registration:", error);
      toast.error("Failed to cancel registration");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't registered for any events yet</p>
        <Button onClick={() => navigate("/events")}>
          Browse Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userEvents.map((userEvent) => {
        const event = userEvent.event;
        const eventDate = new Date(event.date_start);
        const isUpcoming = eventDate > new Date();
        
        return (
          <Card key={userEvent.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.is_online ? "Online" : event.location}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={userEvent.status === "confirmed" ? "default" : "secondary"}
                    className={
                      userEvent.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {userEvent.status}
                  </Badge>
                  
                  {event.ticket_type === "paid" && (
                    <Badge variant="outline">₹{event.ticket_price}</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Ticket className="w-4 h-4 mr-1" />
                  Ticket ID: {userEvent.ticket_id.slice(0, 8)}...
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Event
                  </Button>
                  
                  {userEvent.status === "confirmed" && isUpcoming && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelRegistration(userEvent.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MyEvents;
