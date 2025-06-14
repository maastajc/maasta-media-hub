
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedArtists } from '@/services/optimizedArtistService';
import { Artist } from '@/types/artist';

interface UseArtistsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

export const useArtists = (options: UseArtistsOptions = {}) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000 // 5 minutes
  } = options;

  const query = useQuery({
    queryKey: ['artists'],
    queryFn: () => fetchFeaturedArtists(50), // Fetch more artists but with optimized query
    enabled,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      console.error(`Artists fetch attempt ${failureCount + 1} failed:`, error);
      return failureCount < 1; // Reduce retry attempts
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Faster retries
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
