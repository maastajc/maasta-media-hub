
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";

// Fallback data when database is empty or has issues
const FALLBACK_ARTISTS: Artist[] = [
  {
    id: "fallback-artist-1",
    full_name: "Priya Sharma",
    email: "priya.sharma@example.com",
    bio: "Experienced actress with 8+ years in film and television. Specialized in dramatic roles and character acting.",
    profile_picture_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    category: "actor",
    experience_level: "professional",
    verified: true,
    skills: ["Acting", "Dancing", "Voice Modulation"]
  },
  {
    id: "fallback-artist-2", 
    full_name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    bio: "Professional dancer and choreographer with expertise in contemporary and classical dance forms.",
    profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    city: "Delhi",
    state: "Delhi",
    country: "India", 
    category: "dancer",
    experience_level: "experienced",
    verified: true,
    skills: ["Contemporary Dance", "Choreography", "Hip Hop"]
  },
  {
    id: "fallback-artist-3",
    full_name: "Kavya Reddy", 
    email: "kavya.reddy@example.com",
    bio: "Voice artist and singer with a versatile range. Experience in commercials, dubbing, and live performances.",
    profile_picture_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    city: "Bangalore",
    state: "Karnataka", 
    country: "India",
    category: "voice_artist",
    experience_level: "professional",
    verified: false,
    skills: ["Voice Acting", "Singing", "Dubbing"]
  },
  {
    id: "fallback-artist-4",
    full_name: "Rohan Das",
    email: "rohan.das@example.com", 
    bio: "Versatile performer with skills in acting, modeling, and stunt work. Available for various projects.",
    profile_picture_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    category: "actor", 
    experience_level: "intermediate",
    verified: true,
    skills: ["Acting", "Modeling", "Stunts"]
  }
];

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    // Much shorter timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Featured artists fetch timeout')), 3000)
    );

    const fetchPromise = supabase
      .from('unified_profiles')
      .select(`
        id,
        full_name,
        email,
        bio,
        profile_picture_url,
        city,
        state,
        country,
        category,
        experience_level,
        verified
      `)
      .eq('status', 'active')
      .not('profile_picture_url', 'is', null)
      .limit(limit);

    const { data: artists, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Error fetching featured artists:', error);
      console.log('Using fallback artists data');
      return FALLBACK_ARTISTS.slice(0, limit);
    }

    if (!artists || artists.length === 0) {
      console.log('No featured artists found, using fallback data');
      return FALLBACK_ARTISTS.slice(0, limit);
    }

    console.log(`Successfully fetched ${artists.length} featured artists`);
    
    return artists.map((artist: any) => ({
      ...artist,
      skills: [] // Simplified for now
    }));
  } catch (error) {
    console.error('Error in fetchFeaturedArtists:', error);
    console.log('Using fallback artists data due to error');
    return FALLBACK_ARTISTS.slice(0, limit);
  }
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    
    // Check if it's a fallback ID
    const fallbackArtist = FALLBACK_ARTISTS.find(artist => artist.id === id);
    if (fallbackArtist) {
      return fallbackArtist;
    }
    
    // Shorter timeout for single artist fetch
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Artist fetch timeout')), 5000)
    );

    const fetchPromise = supabase
      .from('unified_profiles')
      .select('*')
      .eq('id', id)
      .single();

    const { data: artist, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Error fetching artist:', error);
      
      if (error.code === 'PGRST116') {
        throw new Error('Artist not found');
      }
      
      throw new Error(error.message || 'Failed to fetch artist');
    }

    if (!artist) {
      throw new Error('Artist not found');
    }

    console.log(`Successfully fetched artist: ${artist.full_name}`);

    return {
      ...artist,
      skills: []
    };
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    
    if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};
