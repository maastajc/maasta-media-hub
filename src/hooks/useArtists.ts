
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cacheManager } from '@/utils/cacheManager';

interface Artist {
  id: string;
  full_name: string;
  email: string;
  profile_picture_url?: string;
  category: string;
  experience_level: string;
  bio?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  years_of_experience?: number;
  skills?: string[];
  created_at: string;
  status: string;
  personal_website?: string;
  linkedin?: string;
  youtube_vimeo?: string;
  instagram?: string;
}

interface UseArtistsOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 500;
const TIMEOUT_MS = 8000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error('Operation failed:', error.message);
    
    if (retries > 0) {
      console.log(`Retrying operation... ${retries} attempts left`);
      await delay(RETRY_DELAY);
      return withRetry(operation, retries - 1);
    }
    
    throw error;
  }
};

export const useArtists = (options: UseArtistsOptions = {}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtists = async () => {
    return withRetry(async () => {
      console.log('Fetching artists with cache-busting...');
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100);

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const { data, error: fetchError } = result as any;

      if (fetchError) {
        console.error('Error fetching artists:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      // Transform data to match expected format
      const transformedData = (data || []).map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name || 'Unknown Artist',
        email: profile.email,
        profile_picture_url: profile.profile_picture_url,
        category: profile.category || 'actor',
        experience_level: profile.experience_level || 'beginner',
        bio: profile.bio,
        location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : profile.city || profile.state,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        years_of_experience: profile.years_of_experience || 0,
        skills: [], // TODO: Add skills relation
        created_at: profile.created_at,
        status: profile.status,
        personal_website: profile.personal_website,
        linkedin: profile.linkedin,
        youtube_vimeo: profile.youtube_vimeo,
        instagram: profile.instagram
      }));

      console.log(`Successfully fetched ${transformedData.length} artists`);
      setArtists(transformedData);
      return transformedData;
    });
  };

  const refetch = async () => {
    try {
      // Clear any cached data before refetching
      cacheManager.invalidateCache('artists');
      await fetchArtists();
    } catch (err: any) {
      console.error('Error in refetch:', err);
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArtists = (artists: Artist[], filters: {
    search?: string;
    category?: string;
    experienceLevel?: string;
    location?: string;
  }) => {
    return artists.filter(artist => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!artist.full_name.toLowerCase().includes(searchLower) &&
            !artist.bio?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && artist.category !== filters.category) {
        return false;
      }

      // Experience level filter
      if (filters.experienceLevel && artist.experience_level !== filters.experienceLevel) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (!artist.location?.toLowerCase().includes(locationLower) &&
            !artist.city?.toLowerCase().includes(locationLower) &&
            !artist.state?.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    const initializeFetch = async () => {
      try {
        await fetchArtists();
      } catch (err: any) {
        console.error('Error in useArtists:', err);
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFetch();
  }, []); // Remove dependencies to prevent unnecessary re-renders

  return {
    artists,
    isLoading,
    isError,
    error,
    refetch,
    filterArtists
  };
};
