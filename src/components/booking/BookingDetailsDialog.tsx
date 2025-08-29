import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User,
  FileText,
  Settings,
  Link as LinkIcon,
  Package,
  Repeat
} from "lucide-react";
import { BookingWithProfiles } from "@/types/booking";

interface BookingDetailsDialogProps {
  booking: BookingWithProfiles;
  isOpen: boolean;
  onClose: () => void;
  isArtistView?: boolean;
}

export const BookingDetailsDialog = ({ 
  booking, 
  isOpen, 
  onClose, 
  isArtistView = false 
}: BookingDetailsDialogProps) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={otherParty?.profile_picture_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{otherParty?.full_name}</h3>
              <p className="text-muted-foreground">
                {isArtistView ? 'Client' : `${booking.category} • ${booking.artist?.category}`}
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Project Type:</span>
                <p className="text-muted-foreground">{booking.project_type}</p>
              </div>
              
              <div>
                <span className="font-medium">Category:</span>
                <p className="text-muted-foreground">{booking.category}</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Event Date:</span>
                  <p className="text-muted-foreground">
                    {format(new Date(booking.event_date), "PPP p")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Location:</span>
                  <p className="text-muted-foreground">{booking.location}</p>
                </div>
              </div>
              
              {booking.duration && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-muted-foreground">{booking.duration}</p>
                  </div>
                </div>
              )}
              
              {booking.budget && (
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium">Budget:</span>
                    <p className="text-muted-foreground">₹{booking.budget.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category-specific fields */}
          {(booking.technical_requirements || booking.script_link || booking.deliverables || 
            booking.num_shows || booking.rehearsal_required !== null) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Specific Requirements
                </h4>
                
                <div className="space-y-3 text-sm">
                  {booking.technical_requirements && (
                    <div>
                      <span className="font-medium">Technical Requirements:</span>
                      <p className="text-muted-foreground mt-1">{booking.technical_requirements}</p>
                    </div>
                  )}
                  
                  {booking.script_link && (
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Script Link:</span>
                        <p className="text-muted-foreground">
                          <a 
                            href={booking.script_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {booking.script_link}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {booking.deliverables && (
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Deliverables:</span>
                        <p className="text-muted-foreground mt-1">{booking.deliverables}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.deadline && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Deadline:</span>
                        <p className="text-muted-foreground">
                          {format(new Date(booking.deadline), "PPP p")}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {booking.num_shows && (
                    <div className="flex items-start gap-2">
                      <Repeat className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Number of Shows:</span>
                        <p className="text-muted-foreground">{booking.num_shows}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.rehearsal_required !== null && (
                    <div>
                      <span className="font-medium">Rehearsal Required:</span>
                      <p className="text-muted-foreground">
                        {booking.rehearsal_required ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* General Requirements and Notes */}
          {(booking.requirements || booking.notes) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Additional Information</h4>
                
                {booking.requirements && (
                  <div>
                    <span className="font-medium text-sm">Requirements:</span>
                    <p className="text-muted-foreground text-sm mt-1">{booking.requirements}</p>
                  </div>
                )}
                
                {booking.notes && (
                  <div>
                    <span className="font-medium text-sm">Notes:</span>
                    <p className="text-muted-foreground text-sm mt-1">{booking.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {format(new Date(booking.created_at), "PPP p")}</p>
            <p>Last updated: {format(new Date(booking.updated_at), "PPP p")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};