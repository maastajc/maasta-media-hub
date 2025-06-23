
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";

interface RegisteredEventsTabProps {
  isLoading: boolean;
  registeredEvents: any[];
  formatDate: (dateString: string) => string;
}

export const RegisteredEventsTab = ({ isLoading, registeredEvents, formatDate }: RegisteredEventsTabProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <EmptyState
        title="You haven't registered for any events yet"
        buttonText="Browse Events"
        buttonAction={() => navigate("/events")}
        buttonClassName="bg-maasta-orange hover:bg-maasta-orange/90"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {registeredEvents.map((registration) => (
        <Card key={registration.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{registration.events.title}</h3>
            <div className="mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {registration.attendance_status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Registered: {formatDate(registration.registered_at)}
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">Date:</span> {formatDate(registration.events.event_date)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Location:</span> {registration.events.location}
            </p>
            <Button 
              onClick={() => navigate(`/events/${registration.event_id}`)}
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              View Event
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
