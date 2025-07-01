
import { Artist } from "@/types/artist";
import { ArtistByIdRow } from "./types";
import { mapArtistByIdToArtist, mapFallbackArtistToArtist } from "./mappers";
import { supabase } from "@/integrations/supabase/client";

const MAX_RETRIES = 1;
const TIMEOUT_MS = 15000; // Increased timeout to 15 seconds
const RETRY_DELAY = 500;

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
    
    if (retries > 0 && (error.message?.includes('timeout') || error.message?.includes('network'))) {
      console.log(`Retrying operation... ${retries} attempts left`);
      await delay(RETRY_DELAY);
      return withRetry(operation, retries - 1);
    }
    
    throw error;
  }
};

const fetchArtistByIdQuery = (id: string) => {
  console.log('Executing main artist by ID query...');
  return supabase
    .from('profiles')
    .select(`
      *,
      special_skills (
        id,
        skill
      ),
      projects (
        id,
        project_name,
        role_in_project,
        project_type,
        year_of_release,
        director_producer,
        streaming_platform,
        link
      ),
      education_training (
        id,
        qualification_name,
        institution,
        year_completed,
        is_academic
      ),
      media_assets (
        id,
        url,
        file_name,
        file_type,
        description,
        is_video,
        is_embed,
        embed_source,
        file_size
      ),
      language_skills (
        id,
        language,
        proficiency
      ),
      tools_software (
        id,
        tool_name
      ),
      awards (
        id,
        title,
        organization,
        year,
        description
      )
    `)
    .eq('id', id)
    .single();
};

const fetchArtistByIdFallbackQuery = (id: string) => {
  console.log('Executing fallback artist by ID query...');
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  return withRetry(async () => {
    console.log('Fetching artist by ID:', id);
    
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
    
    try {
      // Try main query first with increased timeout
      const timeoutPromise = createTimeoutPromise('Profile loading is taking longer than expected. Please try again.', 12000);
      const fetchPromise = fetchArtistByIdQuery(id);

      const result = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as { data: ArtistByIdRow | null; error: any };

      if (result.error) {
        console.error('Database error fetching artist:', result.error);
        
        if (result.error.code === 'PGRST116') { 
          console.log('Artist not found in main query, trying fallback...');
          
          // Try fallback query with longer timeout
          const fallbackTimeoutPromise = createTimeoutPromise('Profile loading timeout. Please check your connection and try again.', 8000);
          const fallbackFetchPromise = fetchArtistByIdFallbackQuery(id);
          
          const fallbackResult = await Promise.race([
            fallbackFetchPromise,
            fallbackTimeoutPromise
          ]) as { data: any; error: any };

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
        
        throw new Error(`Database error: ${result.error.message}`);
      }

      const artistFromDb = result.data;
      if (!artistFromDb) {
        console.error('No artist data returned from main query');
        throw new Error(`No artist data returned for ID: ${id}`);
      }

      console.log(`Successfully fetched artist: ${artistFromDb.full_name}`);
      return mapArtistByIdToArtist(artistFromDb);
      
    } catch (error: any) {
      if (error.message?.includes('timeout')) {
        console.error('Profile fetch timeout, trying simplified approach...');
        
        // Final fallback with minimal data and longer timeout
        try {
          const { data, error: simpleError } = await Promise.race([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', id)
              .single(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Final timeout')), 10000)
            )
          ]) as { data: any; error: any };
            
          if (simpleError || !data) {
            throw new Error('Profile not found or connection issue');
          }
          
          return mapFallbackArtistToArtist(data);
        } catch (finalError) {
          throw new Error('Connection timeout - please check your internet connection and try again');
        }
      }
      throw error;
    }
  });
};
