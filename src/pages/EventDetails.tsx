
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventDetailsCard from "@/components/events/EventDetailsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!id) return;

        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (eventError) {
          throw eventError;
        }

        // Count attendees
        const { count, error: countError } = await supabase
          .from("event_attendees")
          .select("*", { count: "exact", head: true })
          .eq("event_id", id);

        if (countError) {
          throw countError;
        }

        // Check if current user is registered
        if (user) {
          const { data: registrationData, error: registrationError } = await supabase
            .from("event_attendees")
            .select("*")
            .eq("event_id", id)
            .eq("user_id", user.id)
            .single();

          setIsRegistered(!!registrationData);

          // Check if current user is the organizer
          setIsOrganizer(eventData.creator_id === user.id);
        }

        setEvent({ ...eventData, attendeeCount: count || 0 });
        setAttendeeCount(count || 0);
      } catch (error: any) {
        console.error("Error fetching event details:", error.message);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user, toast]);

  const handleRegistration = async () => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "You need to sign in to register for events",
          variant: "default",
        });
        navigate("/sign-in", { state: { returnTo: `/events/${id}` } });
        return;
      }

      setLoading(true);

      if (isRegistered) {
        // Cancel registration
        const { error } = await supabase
          .from("event_attendees")
          .delete()
          .eq("event_id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsRegistered(false);
        setAttendeeCount((prev) => Math.max(0, prev - 1));
        
        toast({
          title: "Registration cancelled",
          description: "You have successfully cancelled your registration",
        });
      } else {
        // Check if event is at capacity
        if (event.max_attendees && attendeeCount >= event.max_attendees) {
          toast({
            title: "Event is full",
            description: "Sorry, this event has reached its maximum capacity",
            variant: "destructive",
          });
          return;
        }

        // Register for event
        const { error } = await supabase
          .from("event_attendees")
          .insert({
            event_id: id,
            user_id: user.id,
            attendance_status: "registered",
          });

        if (error) throw error;

        setIsRegistered(true);
        setAttendeeCount((prev) => prev + 1);
        
        toast({
          title: "Registration successful",
          description: "You have successfully registered for this event",
        });
      }
    } catch (error: any) {
      console.error("Error with registration:", error.message);
      toast({
        title: "Error",
        description: "Failed to process your registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            ← Back to Events
          </Button>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          ) : event ? (
            <EventDetailsCard 
              event={event} 
              onRegister={handleRegistration} 
              isRegistered={isRegistered}
              isOrganizer={isOrganizer}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/events")}>
                Browse All Events
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
