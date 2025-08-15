import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPinIcon, UsersIcon, Clock, ArrowLeft, Share, Heart } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  organizer_info: string;
  banner_url?: string;
  category?: string;
  ticketing_enabled: boolean;
  ticket_price?: number;
  max_attendees?: number;
  creator_id: string;
  status: string;
  created_at: string;
  registration_deadline?: string;
  is_online: boolean;
  organizer_contact?: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  joined_at: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch attendee count
      const { data: registrations, error: countError } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', id)
        .eq('status', 'confirmed');

      if (countError) throw countError;
      setAttendeeCount(registrations?.length || 0);

      // Check if user is registered (if logged in)
      if (user) {
        const { data: userRegistration, error: regError } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .single();

        if (!regError && userRegistration) {
          setRegistration(userRegistration);
        }
      }
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }

    if (!event) return;

    try {
      setRegistering(true);

      if (registration) {
        // Cancel registration
        const { error } = await supabase
          .from('event_registrations')
          .update({ status: 'cancelled' })
          .eq('id', registration.id);

        if (error) throw error;

        setRegistration(null);
        setAttendeeCount(prev => prev - 1);
        
        toast({
          title: "Registration Cancelled",
          description: "You have successfully cancelled your registration.",
        });
      } else {
        // Check if event is full
        if (event.max_attendees && attendeeCount >= event.max_attendees) {
          toast({
            title: "Event Full",
            description: "This event has reached its maximum capacity.",
            variant: "destructive",
          });
          return;
        }

        // Register for event
        const { data, error } = await supabase
          .from('event_registrations')
          .insert([
            {
              event_id: event.id,
              user_id: user.id,
              status: 'confirmed',
              participant_name: user.user_metadata?.full_name || user.email,
              participant_email: user.email,
            }
          ])
          .select()
          .single();

        if (error) throw error;

        setRegistration(data);
        setAttendeeCount(prev => prev + 1);
        
        toast({
          title: "Registration Successful!",
          description: "You have been registered for this event. Check your email for confirmation.",
        });
      }
    } catch (error: any) {
      console.error('Error with registration:', error);
      toast({
        title: "Registration Error",
        description: error.message || "Failed to process registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard!",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted h-64 rounded-lg mb-6"></div>
            <div className="bg-muted h-8 rounded mb-4"></div>
            <div className="bg-muted h-4 rounded mb-2"></div>
            <div className="bg-muted h-4 rounded w-3/4"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();
  const isPaid = event.ticketing_enabled && (event.ticket_price || 0) > 0;
  const isOrganizer = user?.id === event.creator_id;
  const isEventFull = event.max_attendees && attendeeCount >= event.max_attendees;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Banner */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          {event.banner_url ? (
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-6xl">🎪</span>
            </div>
          )}
          
          {!isUpcoming && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="text-lg bg-red-500 px-4 py-2">Event Completed</Badge>
            </div>
          )}
        </div>

        {/* Event Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-2">
                  {event.category && (
                    <Badge variant="secondary">
                      {event.category}
                    </Badge>
                  )}
                  <Badge variant={isPaid ? "destructive" : "secondary"}>
                    {isPaid ? `₹${event.ticket_price}` : 'FREE'}
                  </Badge>
                  {isUpcoming && (
                    <Badge className={registration ? "bg-green-600" : "bg-primary"}>
                      {registration ? "Registered" : "Upcoming"}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm">{format(eventDate, "h:mm a")} • {
                    isUpcoming 
                      ? `${formatDistanceToNow(eventDate, { addSuffix: true })}`
                      : `Ended ${formatDistanceToNow(eventDate, { addSuffix: true })}`
                  }</p>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  {event.is_online && <p className="text-sm">Online Event</p>}
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                <UsersIcon className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">{attendeeCount} registered</p>
                  {event.max_attendees && (
                    <p className="text-sm">
                      {event.max_attendees - attendeeCount} spots remaining (max: {event.max_attendees})
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{event.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="organizer" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organizer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line mb-4">{event.organizer_info}</p>
                    {event.organizer_contact && (
                      <div>
                        <h4 className="font-medium mb-2">Contact</h4>
                        <p className="text-muted-foreground">{event.organizer_contact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="location" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{event.location}</p>
                    {event.is_online ? (
                      <Badge variant="secondary">🌐 Online Event</Badge>
                    ) : (
                      <p className="text-muted-foreground">
                        Detailed location and directions will be provided after registration.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Registration Card */}
          <div className="lg:w-80">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                {isPaid && (
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary">₹{event.ticket_price}</div>
                    <div className="text-sm text-muted-foreground">per ticket</div>
                  </div>
                )}

                {isOrganizer ? (
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => navigate(`/events/edit/${event.id}`)}>
                      Edit Event
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Registrations
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Cancel Event
                    </Button>
                  </div>
                ) : isUpcoming ? (
                  <div className="space-y-4">
                    {isEventFull ? (
                      <Button disabled className="w-full">
                        Event Full
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${registration 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        }`}
                        onClick={handleRegistration}
                        disabled={registering}
                      >
                        {registering 
                          ? "Processing..." 
                          : registration 
                            ? "Cancel Registration" 
                            : isPaid 
                              ? `Book for ₹${event.ticket_price}` 
                              : "Register Free"
                        }
                      </Button>
                    )}
                    
                    {registration && (
                      <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        ✅ You're registered for this event!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    This event has ended.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetails;