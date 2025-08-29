import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";
import { BookingFormData } from "@/types/booking";

const baseSchema = z.object({
  project_type: z.string().min(1, "Project type is required"),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().optional(),
  budget: z.number().min(0).optional(),
  requirements: z.string().optional(),
  notes: z.string().optional(),
});

const musicianSchema = baseSchema.extend({
  technical_requirements: z.string().optional(),
});

const actorSchema = baseSchema.extend({
  script_link: z.string().url().optional().or(z.literal("")),
});

const dancerSchema = baseSchema.extend({
  num_shows: z.number().min(1).optional(),
  rehearsal_required: z.boolean().optional(),
});

const photographerSchema = baseSchema.extend({
  deliverables: z.string().optional(),
  deadline: z.string().optional(),
});

interface BookArtistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistName: string;
  artistCategory: string;
}

export const BookArtistDialog = ({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistCategory,
}: BookArtistDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getSchema = () => {
    switch (artistCategory.toLowerCase()) {
      case 'musician':
        return musicianSchema;
      case 'actor':
        return actorSchema;
      case 'dancer':
        return dancerSchema;
      case 'photographer':
      case 'editor':
        return photographerSchema;
      default:
        return baseSchema;
    }
  };

  const form = useForm<BookingFormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      project_type: "",
      event_date: "",
      location: "",
      duration: "",
      budget: 0,
      requirements: "",
      notes: "",
      technical_requirements: "",
      script_link: "",
      deliverables: "",
      deadline: "",
      num_shows: 1,
      rehearsal_required: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an artist.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createBooking(artistId, user.id, artistCategory, data);
      toast({
        title: "Booking Request Sent",
        description: `Your booking request has been sent to ${artistName}. They will review and respond soon.`,
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectTypeOptions = () => {
    switch (artistCategory.toLowerCase()) {
      case 'musician':
        return ['Concert', 'Recording Session', 'Festival', 'Wedding', 'Private Event'];
      case 'actor':
        return ['Film', 'TV Series', 'Commercial', 'Theater', 'Voice Over'];
      case 'dancer':
        return ['Performance', 'Wedding', 'Music Video', 'Event Entertainment', 'Workshop'];
      case 'photographer':
        return ['Event Photography', 'Portrait Session', 'Product Photography', 'Wedding', 'Commercial'];
      case 'editor':
        return ['Video Editing', 'Film Post-Production', 'Commercial Editing', 'Social Media Content'];
      default:
        return ['Performance', 'Event', 'Project', 'Commercial', 'Private'];
    }
  };

  const renderCategorySpecificFields = () => {
    switch (artistCategory.toLowerCase()) {
      case 'musician':
        return (
          <FormField
            control={form.control}
            name="technical_requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Sound system, instruments, stage setup requirements..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'actor':
        return (
          <FormField
            control={form.control}
            name="script_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Script Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/script.pdf"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'dancer':
        return (
          <>
            <FormField
              control={form.control}
              name="num_shows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shows</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rehearsal_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Rehearsal Required</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </>
        );

      case 'photographer':
      case 'editor':
        return (
          <>
            <FormField
              control={form.control}
              name="deliverables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deliverables</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Number of photos, video format, resolution requirements..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {artistName}</DialogTitle>
          <DialogDescription>
            Send a booking request to {artistName}. They will review and respond to your request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getProjectTypeOptions().map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2 hours, 3 days" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter budget amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderCategorySpecificFields()}

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specific requirements for the booking..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Sending..." : "Send Booking Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};