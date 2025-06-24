
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Artist {
  id: string;
  full_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  experience_level?: string;
  verified: boolean;
}

const fetchArtistsLightweight = async (): Promise<Artist[]> => {
  try {
    console.log('Fetching artists with lightweight query...');
    
    const { data, error } = await supabase
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
        verified
      `)
      .eq('status', 'active')
      .limit(20)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
};

export const useOptimizedArtists = () => {
  return useQuery({
    queryKey: ['artists-optimized'],
    queryFn: fetchArtistsLightweight,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 500,
  });
};
