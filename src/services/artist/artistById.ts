
import { Artist } from "@/types/artist";
import { ArtistByIdRow } from "./types";
import { 
  createTimeoutPromise, 
  fetchArtistByIdQuery, 
  fetchArtistByIdFallbackQuery 
} from "./queries";
import { mapArtistByIdToArtist, mapFallbackArtistToArtist } from "./mappers";

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log('Fetching artist by ID:', id);
    console.log('Request URL:', window.location.href);
    
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid artist ID provided:', id);
      throw new Error('Invalid artist ID provided');
    }
    
    // Add UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error('Invalid UUID format:', id);
      throw new Error(`Invalid artist ID format: ${id}`);
    }
    
    const timeoutPromise = createTimeoutPromise('Profile loading timeout - please try again');
    const fetchPromise = fetchArtistByIdQuery(id);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: ArtistByIdRow | null; error: any };

    if (result.error) {
      console.error('Database error fetching artist:', result.error);
      console.error('Error code:', result.error.code);
      console.error('Error message:', result.error.message);
      
      if (result.error.code === 'PGRST116') { 
        console.log('Artist not found in main query, trying fallback...');
        throw new Error(`Artist not found with ID: ${id}`);
      }
      
      console.log('Trying fallback query without joins...');
      const fallbackResult = await fetchArtistByIdFallbackQuery(id);

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        throw new Error(`Failed to load profile: ${fallbackResult.error.message}`);
      }

      const artistFromDb = fallbackResult.data;
      if (!artistFromDb) {
        console.error('No artist data returned from fallback query');
        throw new Error(`No artist data returned for ID: ${id}`);
      }

      console.log(`Successfully fetched artist (fallback): ${artistFromDb.full_name}`);
      
      return mapFallbackArtistToArtist(artistFromDb);
    }

    const artistFromDb = result.data;

    if (!artistFromDb) {
      console.error('No artist data returned from main query');
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artistFromDb.full_name}`);
    
    return mapArtistByIdToArtist(artistFromDb);
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    console.error('Stack trace:', error.stack);
    throw error; 
  }
};
