
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/types/artist';
import { cacheManager } from '@/utils/cacheManager';

interface UseArtistsOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retry?: number;
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
      console.log('Fetching artists data...');
      
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Check session validity before fetching
      if (!cacheManager.isSessionValid()) {
        console.log('Session invalid, user may need to re-authenticate');
      }

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      );

      // Use clean Supabase client without cache-busting
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        console.error('Error fetching artists:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      // Transform data to match expected format
      const transformedData = (data || []).map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name || 'Unknown Artist',
        email: profile.email,
        username: profile.username,
        profile_picture_url: profile.profile_picture_url,
        category: profile.category || 'actor',
        experience_level: profile.experience_level || 'beginner',
        bio: profile.bio,
        about: profile.about,
        headline: profile.headline,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        years_of_experience: profile.years_of_experience || 0,
        skills: [],
        created_at: profile.created_at,
        status: profile.status,
        personal_website: profile.personal_website,
        linkedin: profile.linkedin,
        youtube_vimeo: profile.youtube_vimeo,
        instagram: profile.instagram,
        verified: profile.verified || false,
        phone_number: profile.phone_number,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        cover_image_url: profile.cover_image_url,
        preferred_domains: profile.preferred_domains,
        role: profile.role || 'artist',
        work_preference: profile.work_preference || 'any',
        willing_to_relocate: profile.willing_to_relocate || false,
        imdb_profile: profile.imdb_profile,
        behance: profile.behance,
        association_membership: profile.association_membership,
        rate_card: profile.rate_card,
        updated_at: profile.updated_at
      })) as Artist[];

      console.log(`Successfully fetched ${transformedData.length} artists`);
      setArtists(transformedData);
      return transformedData;
    }, options.retry || MAX_RETRIES);
  };

  const refetch = async () => {
    try {
      // Only clear specific cache, not everything
      cacheManager.forceClearCache('artists');
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
        if (!artist.city?.toLowerCase().includes(locationLower) &&
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
        // Only refresh cache if it's actually stale (6 hours)
        if (cacheManager.shouldRefreshCache()) {
          console.log('Cache is stale, refreshing data');
          cacheManager.forceClearCache('artists');
        }
        
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
  }, []);

  return {
    artists,
    isLoading,
    isError,
    error,
    refetch,
    filterArtists
  };
};
