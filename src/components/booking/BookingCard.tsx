import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User,
  Check,
  X,
  Eye
} from "lucide-react";
import { BookingWithProfiles } from "@/types/booking";
import { updateBookingStatus } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { BookingDetailsDialog } from "./BookingDetailsDialog";

interface BookingCardProps {
  booking: BookingWithProfiles;
  onStatusUpdate?: (bookingId: string, status: string) => void;
  showActions?: boolean;
  isArtistView?: boolean;
}

export const BookingCard = ({ 
  booking, 
  onStatusUpdate, 
  showActions = false,
  isArtistView = false 
}: BookingCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setIsLoading(true);
    try {
      await updateBookingStatus(booking.id, status);
      onStatusUpdate?.(booking.id, status);
      toast({
        title: "Status Updated",
        description: `Booking has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const otherParty = isArtistView ? booking.booker : booking.artist;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherParty?.profile_picture_url} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {isArtistView ? `Booking from ${otherParty?.full_name}` : `Booking with ${otherParty?.full_name}`}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{booking.project_type}</p>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(booking.event_date), "PPP p")}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{booking.location}</span>
            </div>
            
            {booking.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{booking.duration}</span>
              </div>
            )}
            
            {booking.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>₹{booking.budget.toLocaleString()}</span>
              </div>
            )}
          </div>

          {booking.notes && (
            <div className="text-sm text-muted-foreground">
              <p className="line-clamp-2">"{booking.notes}"</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>

            {showActions && booking.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <BookingDetailsDialog
        booking={booking}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        isArtistView={isArtistView}
      />
    </>
  );
};