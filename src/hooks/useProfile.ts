
// This hook is deprecated - use useArtistProfile instead
import { useArtistProfile } from './useArtistProfile';

export const useProfile = (artistId?: string, options = {}) => {
  console.warn('useProfile is deprecated. Please use useArtistProfile instead.');
  return useArtistProfile(artistId, options);
};

