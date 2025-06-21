
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
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid artist ID provided');
    }
    
    const timeoutPromise = createTimeoutPromise('Profile loading timeout - please try again');
    const fetchPromise = fetchArtistByIdQuery(id);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: ArtistByIdRow | null; error: any };

    if (result.error) {
      console.error('Database error fetching artist:', result.error);
      if (result.error.code === 'PGRST116') { 
        throw new Error(`Artist not found with ID: ${id}`);
      }
      
      console.log('Trying fallback query without joins...');
      const fallbackResult = await fetchArtistByIdFallbackQuery(id);

      if (fallbackResult.error) {
        throw new Error(`Failed to load profile: ${fallbackResult.error.message}`);
      }

      const artistFromDb = fallbackResult.data;
      if (!artistFromDb) {
        throw new Error(`No artist data returned for ID: ${id}`);
      }

      console.log(`Successfully fetched artist (fallback): ${artistFromDb.full_name}`);
      
      return mapFallbackArtistToArtist(artistFromDb);
    }

    const artistFromDb = result.data;

    if (!artistFromDb) {
      throw new Error(`No artist data returned for ID: ${id}`);
    }

    console.log(`Successfully fetched artist: ${artistFromDb.full_name}`);
    
    return mapArtistByIdToArtist(artistFromDb);
  } catch (error: any) {
    console.error('Error in fetchArtistById:', error);
    throw error; 
  }
};
