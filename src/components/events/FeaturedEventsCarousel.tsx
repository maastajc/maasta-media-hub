import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  banner_url?: string;
  category?: string;
  ticketing_enabled: boolean;
  ticket_price?: number;
  max_attendees?: number;
}

interface FeaturedEventsCarouselProps {
  events: Event[];
}

const FeaturedEventsCarousel = ({ events }: FeaturedEventsCarouselProps) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'contests': return '🎭';
      case 'concerts': return '🎤';
      case 'meetups': return '🤝';
      case 'cultural': return '🎓';
      case 'screenings': return '🎬';
      case 'workshops': return '🎨';
      case 'shows': return '🎟';
      default: return '🎪';
    }
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {events.map((event) => {
          const eventDate = new Date(event.event_date);
          const isUpcoming = eventDate > new Date();
          const isPaid = event.ticketing_enabled && (event.ticket_price || 0) > 0;

          return (
            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
                <div className="relative">
                  {event.banner_url ? (
                    <img
                      src={event.banner_url}
                      alt={event.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <span className="text-6xl">{getCategoryIcon(event.category)}</span>
                    </div>
                  )}
                  
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      ⭐ Featured
                    </Badge>
                  </div>
                  
                  {/* Price badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={isPaid ? "destructive" : "secondary"}
                      className={isPaid ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
                    >
                      {isPaid ? `₹${event.ticket_price}` : 'FREE'}
                    </Badge>
                  </div>

                  {/* Event info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-sm mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(eventDate, "MMM d, yyyy • h:mm a")}
                    </div>
                    
                    <div className="flex items-center text-sm mb-3">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={() => navigate(`/events/${event.id}`)}
                      disabled={!isUpcoming}
                    >
                      {isUpcoming ? 'Book Now' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export { FeaturedEventsCarousel };