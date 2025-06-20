
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Event {
  id: string;
  title: string;
  ticket_type: string;
  ticket_price: number | null;
  ticket_limit: number | null;
}

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onRegistrationSuccess: () => void;
}

const EventRegistrationModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onRegistrationSuccess 
}: EventRegistrationModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    participantName: "",
    participantEmail: user?.email || "",
    participantPhone: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is already registered
      const { data: existingRegistration, error: checkError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingRegistration) {
        toast({
          title: "Already registered",
          description: "You are already registered for this event",
          variant: "destructive",
        });
        return;
      }

      // Register for the event
      const { error: insertError } = await supabase
        .from("event_registrations")
        .insert({
          event_id: event.id,
          user_id: user.id,
          participant_name: formData.participantName,
          participant_email: formData.participantEmail,
          participant_phone: formData.participantPhone,
          notes: formData.notes,
          status: "confirmed"
        });

      if (insertError) throw insertError;

      toast({
        title: "Registration successful!",
        description: "You have been registered for this event. Check your email for confirmation.",
      });

      onRegistrationSuccess();
      onClose();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="participantName">Full Name *</Label>
            <Input
              id="participantName"
              value={formData.participantName}
              onChange={(e) => setFormData(prev => ({ ...prev, participantName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="participantEmail">Email *</Label>
            <Input
              id="participantEmail"
              type="email"
              value={formData.participantEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, participantEmail: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="participantPhone">Phone Number</Label>
            <Input
              id="participantPhone"
              type="tel"
              value={formData.participantPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, participantPhone: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requirements or notes..."
            />
          </div>

          {event.ticket_type === "paid" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Ticket Price:</strong> ₹{event.ticket_price}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Payment integration coming soon. For now, contact the organizer for payment details.
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-maasta-orange hover:bg-maasta-orange/90"
            >
              {isSubmitting ? "Registering..." : `Register${event.ticket_type === "paid" ? " & Pay" : ""}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
