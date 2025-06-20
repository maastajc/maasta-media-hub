
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  date_start?: string;
  date_end?: string;
  category?: string;
  status: string;
  creator_profile?: {
    full_name: string;
  };
  is_online?: boolean;
  ticket_type?: string;
  ticket_price?: number;
  max_attendees?: number;
  created_at: string;
}

export const fetchRecentEvents = async (): Promise<Event[]> => {
  try {
    console.log("Fetching recent events...");
    
    // Simplified query with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Recent events fetch timeout')), 10000)
    );

    const fetchPromise = supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        location,
        event_date,
        date_start,
        date_end,
        category,
        status,
        is_online,
        ticket_type,
        ticket_price,
        max_attendees,
        created_at,
        profiles!events_creator_id_fkey(full_name)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    const fetchResult = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: any[] | null; error: any | null };

    if (fetchResult.error) {
      console.error("Error fetching recent events data:", fetchResult.error);
      
      // If there's a foreign key error, try without the profiles join
      if (fetchResult.error.message?.includes('foreign key') || fetchResult.error.message?.includes('relation')) {
        console.log("Trying fallback query without profiles join...");
        const fallbackResult = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            location,
            event_date,
            date_start,
            date_end,
            category,
            status,
            is_online,
            ticket_type,
            ticket_price,
            max_attendees,
            created_at
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (fallbackResult.error) {
          throw fallbackResult.error;
        }

        const eventsData = fallbackResult.data;
        if (!eventsData || eventsData.length === 0) {
          console.log("No recent events found");
          return [];
        }

        console.log(`Successfully fetched ${eventsData.length} recent events (fallback). Processing...`);
        
        const eventsWithCompany = eventsData.map((item: any): Event => {
          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            location: item.location,
            event_date: item.event_date,
            date_start: item.date_start,
            date_end: item.date_end,
            category: item.category,
            status: item.status || 'published',
            creator_profile: {
              full_name: 'Event Organizer' // Default organizer name
            },
            is_online: item.is_online,
            ticket_type: item.ticket_type,
            ticket_price: item.ticket_price,
            max_attendees: item.max_attendees,
            created_at: item.created_at,
          };
        });
        
        console.log(`Processed ${eventsWithCompany.length} recent events with default organizer names.`);
        return eventsWithCompany;
      }
      
      throw fetchResult.error;
    }
    
    const eventsData = fetchResult.data;

    if (!eventsData || eventsData.length === 0) {
      console.log("No recent events found");
      return [];
    }

    console.log(`Successfully fetched ${eventsData.length} recent events. Processing...`);
    
    const eventsWithCompany = eventsData.map((item: any): Event => {
      const organizerName = item.profiles?.full_name || 'Event Organizer';
      return {
        id: item.id,
        title: item.title,
        description: item.description || '',
        location: item.location,
        event_date: item.event_date,
        date_start: item.date_start,
        date_end: item.date_end,
        category: item.category,
        status: item.status || 'published',
        creator_profile: {
          full_name: organizerName
        },
        is_online: item.is_online,
        ticket_type: item.ticket_type,
        ticket_price: item.ticket_price,
        max_attendees: item.max_attendees,
        created_at: item.created_at,
      };
    });
    
    console.log(`Processed ${eventsWithCompany.length} recent events with organizer names.`);
    return eventsWithCompany;
  } catch (error: any) {
    console.error("Error in fetchRecentEvents process:", error);
    
    if (error.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else {
      toast.error("Failed to load recent events");
    }
    
    return [];
  }
};
