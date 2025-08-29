
import { Artist } from "@/types/artist";
import { FeaturedArtistRow } from "./types";
import { mapFeaturedArtistToArtist, mapFallbackArtistToArtist } from "./mappers";
import { supabase } from "@/integrations/supabase/client";

const MAX_RETRIES = 1;
const TIMEOUT_MS = 30000;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createTimeoutPromise = (message: string, timeout: number = TIMEOUT_MS) => {
  return new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error(message)), timeout)
  );
};

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

const fetchFeaturedArtistsQuery = (limit: number) => {
  console.log('Executing featured artists query...');
  
  return supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      bio,
      profile_picture_url,
      city,
      state,
      country,
      category,
      experience_level,
      verified,
      status,
      created_at,
      special_skills (skill)
    `)
    .eq('status', 'active')
    .not('profile_picture_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);
};

const fetchFeaturedArtistsFallbackQuery = (limit: number) => {
  console.log('Executing fallback featured artists query...');
  return supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      bio,
      profile_picture_url,
      city,
      state,
      country,
      category,
      experience_level,
      verified,
      status,
      created_at
    `)
    .eq('status', 'active')
    .not('profile_picture_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);
};

export const fetchFeaturedArtists = async (limit: number = 4): Promise<Artist[]> => {
  return withRetry(async () => {
    console.log('Fetching featured artists...');
    
    const timeoutPromise = createTimeoutPromise('Request timeout - retrying with fresh data');
    const fetchPromise = fetchFeaturedArtistsQuery(limit);

    try {
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
          throw new Error(`Database error: ${fallbackResult.error.message}`);
        }

        const artistsFromDb = fallbackResult.data || [];
        console.log(`Successfully fetched ${artistsFromDb.length} featured artists (fallback)`);
        
        return artistsFromDb.map(mapFallbackArtistToArtist);
      }

      const artistsFromDb = result.data;

      if (!artistsFromDb || artistsFromDb.length === 0) {
        console.log('No featured artists found, trying fallback...');
        const fallbackResult = await fetchFeaturedArtistsFallbackQuery(limit);
        const fallbackData = fallbackResult.data || [];
        return fallbackData.map(mapFallbackArtistToArtist);
      }

      console.log(`Successfully fetched ${artistsFromDb.length} featured artists`);
      
      return artistsFromDb.map(mapFeaturedArtistToArtist);
    } catch (error: any) {
      if (error.message?.includes('timeout')) {
        throw new Error('Connection timeout - trying fallback');
      }
      throw error;
    }
  });
};
