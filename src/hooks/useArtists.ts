
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

      console.log('Raw data from Supabase:', data);

      // Transform data to match expected format with better error handling
      const transformedData = (data || []).map(profile => {
        // Ensure required fields have fallback values
        const transformedProfile: Artist = {
          id: profile.id || '',
          full_name: profile.full_name || 'Unknown Artist',
          email: profile.email || '',
          profile_picture_url: profile.profile_picture_url || undefined,
          category: profile.category || 'actor',
          experience_level: profile.experience_level || 'beginner',
          bio: profile.bio || undefined,
          location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : profile.city || profile.state || '',
          city: profile.city || undefined,
          state: profile.state || undefined,
          country: profile.country || undefined,
          years_of_experience: profile.years_of_experience || 0,
          skills: [], // Initialize as empty array - TODO: Add skills relation when available
          created_at: profile.created_at || new Date().toISOString(),
          status: profile.status || 'active',
          personal_website: profile.personal_website || undefined,
          linkedin: profile.linkedin || undefined,
          youtube_vimeo: profile.youtube_vimeo || undefined,
          instagram: profile.instagram || undefined
        };

        return transformedProfile;
      }).filter(profile => profile.id && profile.full_name); // Filter out invalid profiles

      console.log(`Successfully fetched ${transformedData.length} artists`);
      console.log('Transformed data sample:', transformedData.slice(0, 2));
      
      setArtists(transformedData);
    } catch (err: any) {
      console.error('Error in fetchArtists:', err);
      setIsError(true);
      setError(err);
      // Set empty array on error to prevent blank page but allow UI to show error state
      setArtists([]);
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
    console.log('Filtering artists with filters:', filters);
    console.log('Input artists count:', artists.length);

    if (!artists || !Array.isArray(artists)) {
      console.warn('Invalid artists array provided to filterArtists');
      return [];
    }

    const filtered = artists.filter(artist => {
      // Ensure artist is valid
      if (!artist || typeof artist !== 'object') {
        console.warn('Invalid artist object:', artist);
        return false;
      }

      // Search filter
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = artist.full_name?.toLowerCase().includes(searchLower);
        const bioMatch = artist.bio?.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !bioMatch) {
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
      if (filters.location && filters.location.trim()) {
        const locationLower = filters.location.toLowerCase();
        const locationMatch = artist.location?.toLowerCase().includes(locationLower);
        const cityMatch = artist.city?.toLowerCase().includes(locationLower);
        const stateMatch = artist.state?.toLowerCase().includes(locationLower);
        
        if (!locationMatch && !cityMatch && !stateMatch) {
          return false;
        }
      }

      return true;
    });

    console.log('Filtered artists count:', filtered.length);
    return filtered;
  };

  const refetch = () => {
    console.log('Refetching artists...');
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
