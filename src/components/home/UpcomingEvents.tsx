import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, IndianRupee, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  banner_url?: string;
  category?: string;
  ticket_price?: number;
  ticket_type?: string;
  winning_prize?: number;
  max_attendees?: number;
  creator_id?: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'contest': return '🏆';
      case 'workshop': return '🎓';
      case 'concert': return '🎵';
      case 'meetup': return '🤝';
      case 'cultural fest': return '🎭';
      default: return '📅';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Events
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            No upcoming events at the moment. Check back soon!
          </p>
          <Button 
            onClick={() => navigate('/events')}
            variant="outline"
            size="lg"
          >
            View All Events
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Discover amazing contests, concerts, meetups, and workshops
          </p>
          <Button 
            onClick={() => navigate('/events')}
            variant="outline"
            size="lg"
          >
            View All Events
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md hover:-translate-y-1"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-r from-primary/10 to-secondary/10 relative overflow-hidden">
                {event.banner_url ? (
                  <img 
                    src={event.banner_url} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {getCategoryIcon(event.category)}
                  </div>
                )}
                {event.category && (
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                    {event.category}
                  </Badge>
                )}
                {event.ticket_type === 'free' && (
                  <Badge className="absolute top-3 right-3 bg-green-100 text-green-800 border-green-200">
                    Free
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Date & Location */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                    <span>{format(new Date(event.event_date), 'MMM dd, yyyy • h:mm a')}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-secondary flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Price & Prize */}
                <div className="flex items-center justify-between">
                  {event.ticket_price && event.ticket_price > 0 ? (
                    <div className="flex items-center text-sm font-semibold text-foreground">
                      <IndianRupee className="h-4 w-4 mr-1 text-green-600" />
                      {event.ticket_price}
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Free Entry
                    </Badge>
                  )}
                  
                  {event.winning_prize && (
                    <div className="flex items-center text-sm font-semibold text-secondary">
                      🏆 ₹{event.winning_prize.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Attendees */}
                {event.max_attendees && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    Up to {event.max_attendees} attendees
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}`);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/events')}
              size="lg"
              variant="outline"
              className="px-8"
            >
              View All Events
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;