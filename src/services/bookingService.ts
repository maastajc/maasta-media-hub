import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingFormData, BookingWithProfiles } from "@/types/booking";

export const createBooking = async (
  artistId: string,
  bookerId: string,
  category: string,
  formData: BookingFormData
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      artist_id: artistId,
      booker_id: bookerId,
      category,
      ...formData
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBookingsForArtist = async (artistId: string): Promise<BookingWithProfiles[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get booker profiles separately
  const bookerIds = [...new Set(data.map(booking => booking.booker_id))];
  const { data: bookerProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, profile_picture_url')
    .in('id', bookerIds);

  return data.map(booking => ({
    ...booking,
    artist: { id: artistId, full_name: '', profile_picture_url: '', category: '' },
    booker: bookerProfiles?.find(p => p.id === booking.booker_id) || 
            { id: booking.booker_id, full_name: 'Unknown', profile_picture_url: '' }
  }));
};

export const getBookingsForUser = async (userId: string): Promise<BookingWithProfiles[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booker_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get artist profiles separately
  const artistIds = [...new Set(data.map(booking => booking.artist_id))];
  const { data: artistProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, profile_picture_url, category')
    .in('id', artistIds);

  return data.map(booking => ({
    ...booking,
    booker: { id: userId, full_name: '', profile_picture_url: '' },
    artist: artistProfiles?.find(p => p.id === booking.artist_id) || 
            { id: booking.artist_id, full_name: 'Unknown', profile_picture_url: '', category: '' }
  }));
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'approved' | 'rejected' | 'cancelled'
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};