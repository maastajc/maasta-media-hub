import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, Users, IndianRupee } from "lucide-react";
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
  status: string;
  organizer_info?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();
  const isPaid = event.ticketing_enabled && (event.ticket_price || 0) > 0;

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

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <div className="relative" onClick={handleClick}>
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">{getCategoryIcon(event.category)}</span>
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          {event.category && (
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {getCategoryIcon(event.category)} {event.category}
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isPaid ? "destructive" : "secondary"}
            className={isPaid ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
          >
            {isPaid ? `₹${event.ticket_price}` : 'FREE'}
          </Badge>
        </div>

        {!isUpcoming && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Event Completed
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
            {format(eventDate, "MMM d, yyyy • h:mm a")}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>

          {event.max_attendees && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary" />
              Max {event.max_attendees} attendees
            </div>
          )}
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={handleClick}
          disabled={!isUpcoming}
        >
          {isUpcoming ? (isPaid ? `Book for ₹${event.ticket_price}` : 'Register Free') : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

export { EventCard };