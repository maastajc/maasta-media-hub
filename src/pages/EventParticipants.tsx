
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Mail, Phone } from "lucide-react";

interface EventRegistration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string | null;
  notes: string | null;
  status: string;
  joined_at: string;
  ticket_id: string;
}

interface Event {
  id: string;
  title: string;
  date_start: string;
  location: string;
  creator_id: string;
}

const EventParticipants = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        if (!eventId || !user) return;

        // Fetch event details and verify ownership
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("id, title, date_start, location, creator_id")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;

        // Check if user is the organizer
        if (eventData.creator_id !== user.id) {
          toast({
            title: "Access denied",
            description: "You can only view participants for your own events",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setEvent(eventData);

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("event_id", eventId)
          .order("joined_at", { ascending: false });

        if (participantsError) throw participantsError;

        setParticipants(participantsData || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load event participants",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [eventId, user, toast, navigate]);

  const exportToCSV = () => {
    if (participants.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Registration Date", "Ticket ID", "Status", "Notes"];
    const csvContent = [
      headers.join(","),
      ...participants.map(p => [
        `"${p.participant_name}"`,
        `"${p.participant_email}"`,
        `"${p.participant_phone || ""}"`,
        `"${new Date(p.joined_at).toLocaleDateString()}"`,
        `"${p.ticket_id}"`,
        `"${p.status}"`,
        `"${p.notes || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title.replace(/[^a-zA-Z0-9]/g, "_")}_participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-6xl mx-auto px-4">
            <Skeleton className="h-8 w-64 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
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
        <main className="flex-grow py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const confirmedParticipants = participants.filter(p => p.status === "confirmed");
  const cancelledParticipants = participants.filter(p => p.status === "cancelled");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600">
              {new Date(event.date_start).toLocaleDateString()} • {event.location}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{confirmedParticipants.length}</p>
                  <p className="text-sm text-gray-500">Confirmed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{cancelledParticipants.length}</p>
                  <p className="text-sm text-gray-500">Cancelled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{participants.length}</p>
                  <p className="text-sm text-gray-500">Total Registrations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Participants</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={participants.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No participants yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            {participant.participant_name}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {participant.participant_email}
                              </div>
                              {participant.participant_phone && (
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {participant.participant_phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(participant.joined_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={participant.status === "confirmed" ? "default" : "secondary"}
                              className={
                                participant.status === "confirmed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {participant.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {participant.notes || "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventParticipants;
