
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useArtists = (options: UseArtistsOptions = {}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtists = async () => {
    try {
      console.log('Fetching artists...');
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching artists:', fetchError);
        throw fetchError;
      }

      // Transform data to match expected format
      const transformedData = (data || []).map(profile => ({
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
    } catch (err: any) {
      console.error('Error in fetchArtists:', err);
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

  const refetch = () => {
    fetchArtists();
  };

  useEffect(() => {
    fetchArtists();
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
