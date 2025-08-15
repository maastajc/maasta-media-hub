import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Loader2 } from "lucide-react";

const EditEvent = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    event_date: "",
    date_start: "",
    date_end: "",
    is_online: false,
    ticketing_enabled: false,
    ticket_price: "",
    ticket_limit: "",
    max_attendees: "",
    registration_deadline: "",
    organizer_info: "",
    organizer_contact: "",
    image_url: "",
    banner_url: ""
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !user) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .eq("creator_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            location: data.location || "",
            event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0, 16) : "",
            date_start: data.date_start ? new Date(data.date_start).toISOString().slice(0, 16) : "",
            date_end: data.date_end ? new Date(data.date_end).toISOString().slice(0, 16) : "",
            is_online: data.is_online || false,
            ticketing_enabled: data.ticketing_enabled || false,
            ticket_price: data.ticket_price?.toString() || "",
            ticket_limit: data.ticket_limit?.toString() || "",
            max_attendees: data.max_attendees?.toString() || "",
            registration_deadline: data.registration_deadline ? new Date(data.registration_deadline).toISOString().slice(0, 16) : "",
            organizer_info: data.organizer_info || "",
            organizer_contact: data.organizer_contact || "",
            image_url: data.image_url || "",
            banner_url: data.banner_url || ""
          });
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error",
          description: "Failed to load event details.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, navigate, toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">Please sign in to edit events.</p>
              <Button onClick={() => navigate("/sign-in")} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        ...formData,
        ticket_price: formData.ticket_price ? parseFloat(formData.ticket_price) : null,
        ticket_limit: formData.ticket_limit ? parseInt(formData.ticket_limit) : null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        event_date: new Date(formData.event_date).toISOString(),
        date_start: formData.date_start ? new Date(formData.date_start).toISOString() : null,
        date_end: formData.date_end ? new Date(formData.date_end).toISOString() : null,
        registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", eventId)
        .eq("creator_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event updated successfully!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Same form fields as CreateEvent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contests">🎭 Contests</SelectItem>
                        <SelectItem value="concerts">🎤 Concerts</SelectItem>
                        <SelectItem value="meetups">🤝 Meetups</SelectItem>
                        <SelectItem value="cultural-fests">🎓 Cultural Fests</SelectItem>
                        <SelectItem value="screenings">🎬 Screenings</SelectItem>
                        <SelectItem value="workshops">🎨 Workshops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_online}
                    onCheckedChange={(checked) => handleInputChange("is_online", checked)}
                  />
                  <Label>Online Event</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder={formData.is_online ? "Online platform or URL" : "Venue address"}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date *</Label>
                    <Input
                      id="event_date"
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => handleInputChange("event_date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_start">Start Time</Label>
                    <Input
                      id="date_start"
                      type="datetime-local"
                      value={formData.date_start}
                      onChange={(e) => handleInputChange("date_start", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_end">End Time</Label>
                    <Input
                      id="date_end"
                      type="datetime-local"
                      value={formData.date_end}
                      onChange={(e) => handleInputChange("date_end", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.ticketing_enabled}
                    onCheckedChange={(checked) => handleInputChange("ticketing_enabled", checked)}
                  />
                  <Label>Enable Ticketing</Label>
                </div>

                {formData.ticketing_enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ticket_price">Ticket Price (₹)</Label>
                      <Input
                        id="ticket_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ticket_price}
                        onChange={(e) => handleInputChange("ticket_price", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket_limit">Ticket Limit</Label>
                      <Input
                        id="ticket_limit"
                        type="number"
                        min="1"
                        value={formData.ticket_limit}
                        onChange={(e) => handleInputChange("ticket_limit", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_deadline">Registration Deadline</Label>
                      <Input
                        id="registration_deadline"
                        type="datetime-local"
                        value={formData.registration_deadline}
                        onChange={(e) => handleInputChange("registration_deadline", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    min="1"
                    value={formData.max_attendees}
                    onChange={(e) => handleInputChange("max_attendees", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizer_info">Organizer Info</Label>
                    <Input
                      id="organizer_info"
                      value={formData.organizer_info}
                      onChange={(e) => handleInputChange("organizer_info", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer_contact">Organizer Contact</Label>
                    <Input
                      id="organizer_contact"
                      value={formData.organizer_contact}
                      onChange={(e) => handleInputChange("organizer_contact", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Event Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange("image_url", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner_url">Banner Image URL</Label>
                    <Input
                      id="banner_url"
                      type="url"
                      value={formData.banner_url}
                      onChange={(e) => handleInputChange("banner_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {isSubmitting ? "Updating..." : "Update Event"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditEvent;
