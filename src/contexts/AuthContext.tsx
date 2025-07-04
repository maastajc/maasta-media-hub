
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  // Add other profile fields as needed
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth event:', event, 'Session exists:', !!session);
        
        // Synchronous state updates only
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer any async operations to prevent blocking
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const userProfile = await fetchProfile(session.user.id);
              if (isMounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error fetching profile after auth change:', error);
              if (isMounted) {
                setProfile(null);
              }
            }
            
            // Handle navigation only for specific events
            if (event === 'SIGNED_IN' && isMounted) {
              const isOAuthCallback = location.pathname === '/' && 
                (window.location.hash.includes('access_token') || 
                 window.location.search.includes('code'));
              
              if (isOAuthCallback || location.pathname === '/sign-in') {
                setTimeout(() => {
                  if (isMounted) {
                    navigate('/profile');
                  }
                }, 100);
              }
            }
          }, 0);
        } else if (!session) {
          setProfile(null);
        }
        
        // Always set loading to false after processing auth state
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 100);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        if (!isMounted) return;
        
        console.log('Initial session check:', !!existingSession);
        
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        if (existingSession?.user) {
          try {
            const userProfile = await fetchProfile(existingSession.user.id);
            if (isMounted) {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Error fetching initial profile:', error);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/profile`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

