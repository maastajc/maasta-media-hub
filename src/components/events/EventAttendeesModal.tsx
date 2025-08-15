import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Attendee {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  ticket_type_name: string;
  ticket_price: number;
  joined_at: string;
  status: string;
}

interface EventAttendeesModalProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EventAttendeesModal = ({ eventId, eventTitle, isOpen, onClose }: EventAttendeesModalProps) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          id,
          participant_name,
          participant_email,
          participant_phone,
          ticket_type_name,
          ticket_price,
          joined_at,
          status
        `)
        .eq("event_id", eventId)
        .order("joined_at", { ascending: false });

      if (error) throw error;
      setAttendees(data || []);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      toast.error("Failed to load attendees");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (attendees.length === 0) {
      toast.error("No attendees to export");
      return;
    }

    const headers = ["Full Name", "Email", "Phone Number", "Ticket Type", "Ticket Price", "Registration Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...attendees.map(attendee => [
        `"${attendee.participant_name || ''}"`,
        `"${attendee.participant_email || ''}"`,
        `"${attendee.participant_phone || ''}"`,
        `"${attendee.ticket_type_name || 'General'}"`,
        `"${attendee.ticket_price || 0}"`,
        `"${format(new Date(attendee.joined_at), 'dd/MM/yyyy HH:mm')}"`,
        `"${attendee.status || 'confirmed'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const eventName = eventTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const dateStr = format(new Date(), "yyyyMMdd");
    link.download = `${eventName}_attendees_${dateStr}.csv`;
    
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Attendee list downloaded successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event Attendees - {eventTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Total Registrations: {attendees.length}
          </p>
          <Button 
            onClick={downloadCSV} 
            variant="outline" 
            size="sm"
            disabled={attendees.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendees registered yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">
                      {attendee.participant_name || "-"}
                    </TableCell>
                    <TableCell>{attendee.participant_email || "-"}</TableCell>
                    <TableCell>{attendee.participant_phone || "-"}</TableCell>
                    <TableCell>{attendee.ticket_type_name || "General"}</TableCell>
                    <TableCell>
                      {attendee.ticket_price ? `₹${attendee.ticket_price}` : "Free"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(attendee.joined_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        attendee.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendee.status || 'confirmed'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};