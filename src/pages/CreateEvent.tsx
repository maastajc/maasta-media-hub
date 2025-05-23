
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  organizerInfo: z.string().optional(),
  bannerUrl: z.string().optional(),
  ticketingEnabled: z.boolean().default(false),
  ticketPrice: z.string().optional(),
  maxAttendees: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      organizerInfo: "",
      bannerUrl: "",
      ticketingEnabled: false,
      ticketPrice: "",
      maxAttendees: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an event",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Process form values
      const eventData = {
        title: values.title,
        description: values.description,
        location: values.location,
        event_date: values.eventDate.toISOString(),
        organizer_info: values.organizerInfo || null,
        banner_url: values.bannerUrl || null,
        creator_id: user.id,
        ticketing_enabled: values.ticketingEnabled,
        ticket_price: values.ticketPrice ? parseFloat(values.ticketPrice) : null,
        max_attendees: values.maxAttendees ? parseInt(values.maxAttendees) : null,
      };
      
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select("id")
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Event created successfully",
        description: "Your event has been published",
      });
      
      navigate(`/events/${data.id}`);
    } catch (error: any) {
      console.error("Error creating event:", error.message);
      toast({
        title: "Error creating event",
        description: error.message || "An error occurred while creating the event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Create a New Event</CardTitle>
              <CardDescription>
                Fill out the form below to create and publish your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Venue, or Online" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Event Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="organizerInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer Information</FormLabel>
                        <FormControl>
                          <Input placeholder="About the organizer (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bannerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Image URL for event banner (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ticketingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Ticketing</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Allow attendees to purchase tickets for this event
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("ticketingEnabled") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ticketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Price in INR"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxAttendees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Attendees</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Leave blank for no limit"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-maasta-orange hover:bg-maasta-orange/90"
                    >
                      {isSubmitting ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;
