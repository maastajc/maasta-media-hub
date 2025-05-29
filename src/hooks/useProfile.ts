
// This hook is deprecated - use useArtistProfile instead
import { useArtistProfile } from './useArtistProfile';

export const useProfile = () => {
  console.warn('useProfile is deprecated. Please use useArtistProfile instead.');
  return useArtistProfile();
};
