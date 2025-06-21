
import { Artist } from "@/types/artist";
import { FeaturedArtistRow } from "./types";
import { 
  createTimeoutPromise, 
  fetchFeaturedArtistsQuery, 
  fetchFeaturedArtistsFallbackQuery 
} from "./queries";
import { mapFeaturedArtistToArtist, mapFallbackArtistToArtist } from "./mappers";

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  try {
    console.log('Fetching featured artists...');
    
    const timeoutPromise = createTimeoutPromise('Request timeout - please check your connection');
    const fetchPromise = fetchFeaturedArtistsQuery(limit);

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: FeaturedArtistRow[] | null; error: any };

    if (result.error) {
      console.error('Database error fetching featured artists:', result.error);
      
      console.log('Trying fallback query without special_skills join...');
      const fallbackResult = await fetchFeaturedArtistsFallbackQuery(limit);

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        return [];
      }

      const artistsFromDb = fallbackResult.data || [];
      console.log(`Successfully fetched ${artistsFromDb.length} featured artists (fallback)`);
      
      return artistsFromDb.map(mapFallbackArtistToArtist);
    }

    const artistsFromDb = result.data;

    if (!artistsFromDb || artistsFromDb.length === 0) {
      console.log('No featured artists found');
      return [];
    }

    console.log(`Successfully fetched ${artistsFromDb.length} featured artists`);
    
    return artistsFromDb.map(mapFeaturedArtistToArtist);
  } catch (error: any) {
    console.error('Error in fetchFeaturedArtists:', error);
    return [];
  }
};
