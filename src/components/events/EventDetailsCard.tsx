
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, UsersIcon, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface EventDetailsCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
    organizer_info: string;
    banner_url?: string;
    ticketing_enabled: boolean;
    ticket_price?: number;
    max_attendees?: number;
    attendeeCount?: number;
  };
  onRegister: () => void;
  isRegistered?: boolean;
  isOrganizer?: boolean;
}

const EventDetailsCard = ({
  event,
  onRegister,
  isRegistered = false,
  isOrganizer = false,
}: EventDetailsCardProps) => {
  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      {event.banner_url ? (
        <div className="relative w-full h-64">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {!isUpcoming && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge className="text-lg bg-red-500 px-4 py-2">Event Completed</Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-maasta-purple/20 to-maasta-orange/20 h-32 flex items-center justify-center">
          <h3 className="text-2xl font-semibold text-gray-600">No banner image</h3>
        </div>
      )}
      
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {isUpcoming && (
            <Badge className={isRegistered ? "bg-green-600" : "bg-maasta-purple"}>
              {isRegistered ? "Registered" : "Upcoming"}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-gray-600 mb-6">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span className="mr-6">{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
          
          <Clock className="w-5 h-5 mr-2" />
          <span>{format(eventDate, "h:mm a")}</span>
          
          <span className="ml-6 text-gray-500 text-sm">
            {isUpcoming 
              ? `Happening ${formatDistanceToNow(eventDate, { addSuffix: true })}`
              : `Took place ${formatDistanceToNow(eventDate, { addSuffix: true })}`}
          </span>
        </div>

        <div className="flex items-start text-gray-600 mb-6">
          <MapPinIcon className="w-5 h-5 mr-2 mt-1" />
          <div>
            <p>{event.location}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
        
        {event.organizer_info && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Organizer Information</h3>
            <p className="text-gray-700">{event.organizer_info}</p>
          </div>
        )}
        
        <div className="flex items-center mb-2">
          <UsersIcon className="w-5 h-5 mr-2" />
          <span>
            {event.attendeeCount || 0} registered
            {event.max_attendees && ` (max: ${event.max_attendees})`}
          </span>
        </div>
        
        {event.ticketing_enabled && event.ticket_price && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Ticket Information</h3>
            <p className="text-gray-700">
              Ticket price: <span className="font-semibold">${event.ticket_price}</span>
            </p>
            {event.max_attendees && (
              <p className="text-gray-700">
                Available tickets: {event.max_attendees - (event.attendeeCount || 0)}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t px-6 py-4">
        {isOrganizer ? (
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button className="bg-maasta-purple hover:bg-maasta-purple/90">
              Edit Event
            </Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              Cancel Event
            </Button>
          </div>
        ) : isUpcoming ? (
          <Button 
            className={isRegistered 
              ? "bg-red-500 hover:bg-red-600 w-full sm:w-auto" 
              : "bg-maasta-orange hover:bg-maasta-orange/90 w-full sm:w-auto"}
            onClick={onRegister}
          >
            {isRegistered ? "Cancel Registration" : "Register for Event"}
            {event.ticketing_enabled && !isRegistered && event.ticket_price && ` • $${event.ticket_price}`}
          </Button>
        ) : (
          <p className="text-gray-500">This event has already taken place.</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventDetailsCard;
