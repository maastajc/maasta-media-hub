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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(2, "Location is required"),
  isOnline: z.boolean().default(false),
  dateStart: z.date({
    required_error: "Start date is required",
  }),
  dateEnd: z.date({
    required_error: "End date is required",
  }),
  registrationDeadline: z.date().optional(),
  imageUrl: z.string().optional(),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.string().optional(),
  ticketLimit: z.string().optional(),
  organizerContact: z.string().optional(),
  isTalentNeeded: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("published"),
});

type FormValues = z.infer<typeof formSchema>;

const EVENT_CATEGORIES = [
  "Contest",
  "Course", 
  "Workshop",
  "College Event",
  "Concert",
  "Promo Event",
  "Conference",
  "Seminar",
  "Networking",
  "Exhibition",
  "Other"
];

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
      category: "",
      location: "",
      isOnline: false,
      imageUrl: "",
      ticketType: "free",
      ticketPrice: "",
      ticketLimit: "",
      organizerContact: "",
      isTalentNeeded: false,
      status: "published",
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

    // Validate dates
    if (values.dateEnd < values.dateStart) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    if (values.registrationDeadline && values.registrationDeadline > values.dateStart) {
      toast({
        title: "Invalid registration deadline",
        description: "Registration deadline must be before event start date",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const eventData = {
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        is_online: values.isOnline,
        date_start: values.dateStart.toISOString(),
        date_end: values.dateEnd.toISOString(),
        registration_deadline: values.registrationDeadline?.toISOString() || null,
        image_url: values.imageUrl || null,
        ticket_type: values.ticketType,
        ticket_price: values.ticketType === "paid" && values.ticketPrice ? parseFloat(values.ticketPrice) : null,
        ticket_limit: values.ticketLimit ? parseInt(values.ticketLimit) : null,
        organizer_contact: values.organizerContact || null,
        is_talent_needed: values.isTalentNeeded,
        status: values.status,
        creator_id: user.id,
        // Keep backward compatibility
        event_date: values.dateStart.toISOString(),
        organizer_info: values.organizerContact || null,
        ticketing_enabled: values.ticketType === "paid",
        max_attendees: values.ticketLimit ? parseInt(values.ticketLimit) : null,
      };
      
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select("id")
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Event created successfully",
        description: `Your event has been ${values.status}`,
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category*</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase()}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              placeholder="Enter detailed event description"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location & Format */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location & Format</h3>
                    
                    <FormField
                      control={form.control}
                      name="isOnline"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Online Event</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Is this an online event?
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
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("isOnline") ? "Online Link/Platform*" : "Venue/Location*"}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={
                                form.watch("isOnline") 
                                  ? "e.g., Zoom link, YouTube Live, etc." 
                                  : "e.g., City, Venue name, Address"
                              } 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Date & Time</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dateStart"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date & Time*</FormLabel>
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
                                      <span>Select start date</span>
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
                      
                      <FormField
                        control={form.control}
                        name="dateEnd"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date & Time*</FormLabel>
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
                                      <span>Select end date</span>
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
                      name="registrationDeadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Registration Deadline (Optional)</FormLabel>
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
                                    <span>Select registration deadline</span>
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

                  {/* Ticketing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ticketing</h3>
                    
                    <FormField
                      control={form.control}
                      name="ticketType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Type*</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("ticketType") === "paid" && (
                      <FormField
                        control={form.control}
                        name="ticketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Price (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter price in INR"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="ticketLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Participants (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Leave blank for unlimited"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Poster/Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organizerContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact email or phone (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isTalentNeeded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Talent Needed</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Are you looking for performers/talent for this event?
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
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="published">Publish Now</SelectItem>
                              <SelectItem value="draft">Save as Draft</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-maasta-orange hover:bg-maasta-orange/90"
                    >
                      {isSubmitting ? "Creating..." : `${form.watch("status") === "draft" ? "Save Draft" : "Create Event"}`}
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
