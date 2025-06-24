
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/types/artist';

interface UseArtistsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

const fetchArtistsOptimized = async (): Promise<Artist[]> => {
  console.log('Fetching artists with optimized query...');
  
  try {
    // Reduced timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Artists fetch timeout - please check your connection')), 6000)
    );

    // Simplified query without joins
    const fetchPromise = supabase
      .from('profiles')
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
        verified,
        status,
        created_at,
        updated_at
      `)
      .eq('status', 'active')
      .limit(50);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: any[] | null; error: any };

    if (result.error) {
      console.error('Database error:', result.error);
      return [];
    }

    const artists = result.data || [];
    if (artists.length === 0) {
      console.log('No artists found');
      return [];
    }

    console.log(`Successfully fetched ${artists.length} artists`);
    
    // Transform the data to match our Artist interface
    const transformedArtists = artists.map((artist: any) => {
      return {
        id: artist.id,
        full_name: artist.full_name || 'Unknown Artist',
        email: artist.email,
        bio: artist.bio,
        profile_picture_url: artist.profile_picture_url,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        category: artist.category,
        experience_level: artist.experience_level,
        verified: artist.verified || false,
        skills: [], // Empty array since we're not fetching skills to avoid timeout
        special_skills: [],
        // Add default values for required fields
        phone_number: null,
        date_of_birth: null,
        gender: null,
        willing_to_relocate: false,
        work_preference: "any",
        years_of_experience: 0,
        association_membership: null,
        personal_website: null,
        instagram: null,
        linkedin: null,
        youtube_vimeo: null,
        role: 'artist',
        status: 'active',
        created_at: artist.created_at || new Date().toISOString(),
        updated_at: artist.updated_at || new Date().toISOString(),
        projects: [],
        education_training: [],
        media_assets: [],
        language_skills: [],
        tools_software: []
      } as Artist;
    });

    return transformedArtists;
  } catch (error: any) {
    console.error('Error in fetchArtistsOptimized:', error);
    return [];
  }
};

export const useArtists = (options: UseArtistsOptions = {}) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000 // 5 minutes
  } = options;

  const query = useQuery({
    queryKey: ['artists'],
    queryFn: fetchArtistsOptimized,
    enabled,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      console.error(`Artists fetch attempt ${failureCount + 1} failed:`, error);
      return failureCount < 1; // Only retry once
    },
    retryDelay: 1000, // 1 second between retries
  });

  // Filter and search functionality
  const filterArtists = (
    artists: Artist[],
    filters: {
      search?: string;
      category?: string;
      location?: string;
      experienceLevel?: string;
    }
  ) => {
    if (!artists || artists.length === 0) return [];

    return artists.filter(artist => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = artist.full_name?.toLowerCase().includes(searchTerm);
        const matchesBio = artist.bio?.toLowerCase().includes(searchTerm);
        const matchesSkills = artist.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        );
        
        if (!matchesName && !matchesBio && !matchesSkills) {
          return false;
        }
      }

      // Category filter
      if (filters.category && artist.category !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const locationMatch = 
          artist.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
          artist.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
          artist.country?.toLowerCase().includes(filters.location.toLowerCase());
        
        if (!locationMatch) {
          return false;
        }
      }

      // Experience level filter
      if (filters.experienceLevel && artist.experience_level !== filters.experienceLevel) {
        return false;
      }

      return true;
    });
  };

  return {
    // Data
    artists: query.data || [],
    
    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    
    // Error states
    isError: query.isError,
    error: query.error,
    
    // Actions
    refetch: query.refetch,
    
    // Utility functions
    filterArtists,
    
    // Query metadata
    dataUpdatedAt: query.dataUpdatedAt,
    isStale: query.isStale,
  };
};
