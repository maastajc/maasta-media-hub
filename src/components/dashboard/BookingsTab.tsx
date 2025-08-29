import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/booking/BookingCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { getBookingsForUser, getBookingsForArtist } from "@/services/bookingService";
import { BookingWithProfiles } from "@/types/booking";
import { EmptyState } from "./EmptyState";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export const BookingsTab = () => {
  const [sentBookings, setSentBookings] = useState<BookingWithProfiles[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<BookingWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const [sentData, receivedData] = await Promise.all([
          getBookingsForUser(user.id),
          getBookingsForArtist(user.id)
        ]);
        
        setSentBookings(sentData);
        setReceivedBookings(receivedData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleStatusUpdate = (bookingId: string, status: string) => {
    setReceivedBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: status as any }
          : booking
      )
    );
  };

  const filterBookingsByStatus = (bookings: BookingWithProfiles[], status?: string) => {
    if (!status) return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">My Requests ({sentBookings.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({sentBookings.length})</TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending ({filterBookingsByStatus(sentBookings, 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved ({filterBookingsByStatus(sentBookings, 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Rejected ({filterBookingsByStatus(sentBookings, 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {sentBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No booking requests sent"
                  description="You haven't sent any booking requests yet. Browse artists and send your first booking request!"
                />
              ) : (
                <div className="grid gap-4">
                  {sentBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      isArtistView={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(sentBookings, 'pending').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isArtistView={false}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(sentBookings, 'approved').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isArtistView={false}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(sentBookings, 'rejected').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isArtistView={false}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({receivedBookings.length})</TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending ({filterBookingsByStatus(receivedBookings, 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved ({filterBookingsByStatus(receivedBookings, 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Rejected ({filterBookingsByStatus(receivedBookings, 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {receivedBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No booking requests received"
                  description="You haven't received any booking requests yet. Complete your profile to start receiving bookings!"
                />
              ) : (
                <div className="grid gap-4">
                  {receivedBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={booking.status === 'pending'}
                      onStatusUpdate={handleStatusUpdate}
                      isArtistView={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(receivedBookings, 'pending').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={true}
                    onStatusUpdate={handleStatusUpdate}
                    isArtistView={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(receivedBookings, 'approved').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isArtistView={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <div className="grid gap-4">
                {filterBookingsByStatus(receivedBookings, 'rejected').map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isArtistView={true}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};