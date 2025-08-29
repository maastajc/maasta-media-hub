export interface Booking {
  id: string;
  artist_id: string;
  booker_id: string;
  category: string;
  project_type: string;
  event_date: string;
  location: string;
  duration?: string;
  budget?: number;
  requirements?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  technical_requirements?: string;
  script_link?: string;
  deliverables?: string;
  deadline?: string;
  num_shows?: number;
  rehearsal_required?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  project_type: string;
  event_date: string;
  location: string;
  duration?: string;
  budget?: number;
  requirements?: string;
  notes?: string;
  technical_requirements?: string;
  script_link?: string;
  deliverables?: string;
  deadline?: string;
  num_shows?: number;
  rehearsal_required?: boolean;
}

export interface BookingWithProfiles extends Booking {
  artist: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
    category: string;
  };
  booker: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
  };
}