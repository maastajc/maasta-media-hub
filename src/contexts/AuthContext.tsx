
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const ensureProfileExists = async (userId: string): Promise<void> => {
  try {
    console.log('Ensuring profile exists for user:', userId);
    
    // Check if artist_details record exists
    const { data: existingArtist, error: checkError } = await supabase
      .from('artist_details')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking artist_details:', checkError);
      throw checkError;
    }

    // If no record exists, create one from auth user data
    if (!existingArtist) {
      console.log('Creating missing artist_details record for user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('artist_details')
        .insert({
          id: userId,
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'New User',
          email: user?.email || '',
          role: 'artist',
          category: 'actor',
          experience_level: 'beginner',
          years_of_experience: 0,
          status: 'active'
        });

      if (insertError) {
        console.error('Error creating artist_details record:', insertError);
        throw insertError;
      }
      
      console.log('Successfully created artist_details record');
    }
  } catch (error: any) {
    console.error('Error in ensureProfileExists:', error);
    throw error;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Ensure profile exists if user is logged in
      if (session?.user?.id) {
        ensureProfileExists(session.user.id).catch(console.error);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Ensure profile exists when user signs in
      if (event === 'SIGNED_IN' && session?.user?.id) {
        try {
          await ensureProfileExists(session.user.id);
        } catch (error) {
          console.error('Failed to ensure profile exists:', error);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
