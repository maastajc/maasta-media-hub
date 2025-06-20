
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import { Calendar, MapPin, Clock, Users, Phone, Mail } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  is_online: boolean;
  date_start: string;
  date_end: string;
  ticket_type: string;
  ticket_price: number | null;
  ticket_limit: number | null;
  image_url: string | null;
  organizer_contact: string | null;
  registration_deadline: string | null;
  is_talent_needed: boolean;
  creator_id: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

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
          if (eventError.code === "PGRST116") {
            toast({
              title: "Event not found",
              description: "The event you're looking for doesn't exist",
              variant: "destructive",
            });
            navigate("/events");
            return;
          }
          throw eventError;
        }

        setEvent(eventData);
        setIsOrganizer(user?.id === eventData.creator_id);

        // Count registrations
        const { count, error: countError } = await supabase
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("event_id", id)
          .eq("status", "confirmed");

        if (countError) {
          console.error("Count error:", countError);
        } else {
          setRegistrationCount(count || 0);
        }

        // Check if current user is registered
        if (user) {
          const { data: registrationData } = await supabase
            .from("event_registrations")
            .select("*")
            .eq("event_id", id)
            .eq("user_id", user.id)
            .eq("status", "confirmed")
            .single();

          setIsRegistered(!!registrationData);
        }
      } catch (error: any) {
        console.error("Error fetching event details:", error);
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
  }, [id, user, toast, navigate]);

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setRegistrationCount(prev => prev + 1);
  };

  const isEventExpired = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  const isRegistrationClosed = (event: Event) => {
    if (event.registration_deadline) {
      return new Date(event.registration_deadline) < new Date();
    }
    return isEventExpired(event.date_start);
  };

  const isEventFull = (event: Event) => {
    return event.ticket_limit ? registrationCount >= event.ticket_limit : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6">
              ← Back to Events
            </Button>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6" onClick={() => navigate("/events")}>
              ← Back to Events
            </Button>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/events")}>
                Browse All Events
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const expired = isEventExpired(event.date_start);
  const regClosed = isRegistrationClosed(event);
  const eventFull = isEventFull(event);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Image */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <img
                  src={event.image_url || "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {expired && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg">Event Ended</Badge>
                  </div>
                )}
              </div>

              {/* Event Title and Meta */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">
                    {event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}
                  </Badge>
                  <Badge 
                    variant={event.ticket_type === "free" ? "secondary" : "default"}
                    className={event.ticket_type === "free" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                  >
                    {event.ticket_type === "free" ? "Free" : `₹${event.ticket_price}`}
                  </Badge>
                  {event.is_online && (
                    <Badge variant="outline">Online</Badge>
                  )}
                  {event.is_talent_needed && (
                    <Badge className="bg-purple-100 text-purple-800">Talent Needed</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">
                        {new Date(event.date_start).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm">
                        {new Date(event.date_start).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.date_end).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">
                        {event.is_online ? "Online Event" : "In-Person"}
                      </p>
                      <p className="text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>

                {event.registration_deadline && (
                  <div className="flex items-center text-orange-600 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <p className="text-sm">
                      Registration closes: {new Date(event.registration_deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>

              {/* Organizer Contact */}
              {event.organizer_contact && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Contact Organizer</h2>
                    <div className="flex items-center text-gray-600">
                      {event.organizer_contact.includes('@') ? (
                        <Mail className="w-4 h-4 mr-2" />
                      ) : (
                        <Phone className="w-4 h-4 mr-2" />
                      )}
                      <span>{event.organizer_contact}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Participants</span>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="font-medium">
                          {registrationCount}
                          {event.ticket_limit && ` / ${event.ticket_limit}`}
                        </span>
                      </div>
                    </div>

                    {event.ticket_type === "paid" && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Price</span>
                        <span className="font-bold text-lg">₹{event.ticket_price}</span>
                      </div>
                    )}

                    <Separator />

                    {isOrganizer ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 text-center">You are the organizer</p>
                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/organizer/events/${event.id}/participants`)}
                        >
                          View Participants
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {isRegistered ? (
                          <div className="text-center">
                            <Badge className="bg-green-100 text-green-800 mb-2">
                              ✓ Registered
                            </Badge>
                            <p className="text-sm text-gray-500">
                              You're registered for this event
                            </p>
                          </div>
                        ) : (
                          <>
                            {expired ? (
                              <Button disabled className="w-full">
                                Event Ended
                              </Button>
                            ) : regClosed ? (
                              <Button disabled className="w-full">
                                Registration Closed
                              </Button>
                            ) : eventFull ? (
                              <Button disabled className="w-full">
                                Event Full
                              </Button>
                            ) : (
                              <Button 
                                className="w-full bg-maasta-orange hover:bg-maasta-orange/90"
                                onClick={() => {
                                  if (!user) {
                                    toast({
                                      title: "Sign in required",
                                      description: "Please sign in to register for events",
                                    });
                                    navigate("/sign-in", { state: { returnTo: `/events/${id}` } });
                                    return;
                                  }
                                  setShowRegistrationModal(true);
                                }}
                              >
                                {event.ticket_type === "paid" ? "Register & Pay" : "Register Now"}
                              </Button>
                            )}
                            
                            {eventFull && !regClosed && !expired && (
                              <p className="text-xs text-red-500 text-center">
                                This event has reached its maximum capacity
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Share buttons could go here */}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={event}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default EventDetails;
