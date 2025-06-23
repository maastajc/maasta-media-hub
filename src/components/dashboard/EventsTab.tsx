
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";

interface EventsTabProps {
  isLoading: boolean;
  userEvents: any[];
  formatDate: (dateString: string) => string;
}

export const EventsTab = ({ isLoading, userEvents, formatDate }: EventsTabProps) => {
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
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userEvents.length === 0) {
    return (
      <EmptyState
        title="You haven't created any events yet"
        buttonText="Create Your First Event"
        buttonAction={() => navigate("/events/create")}
        buttonClassName="bg-maasta-orange hover:bg-maasta-orange/90"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {userEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="h-12 bg-maasta-orange flex items-center px-4">
            <h3 className="font-semibold text-white">{event.title}</h3>
          </div>
          <CardContent className="p-4">
            <div className="mb-4">
              <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(event.event_date)}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {event.location}</p>
              <p className="text-sm"><span className="font-medium">Created:</span> {formatDate(event.created_at)}</p>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={() => navigate(`/events/${event.id}`)}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                View
              </Button>
              <Button 
                onClick={() => navigate(`/events/edit/${event.id}`)}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
