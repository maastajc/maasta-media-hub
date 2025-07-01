
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
  // Add other profile fields as needed
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  sessionValid: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
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
  const [sessionValid, setSessionValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validateSession = (currentSession: Session | null): boolean => {
    if (!currentSession) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = currentSession.expires_at;
    
    // Check if session is expired (with 5 minute buffer)
    if (expiresAt && now >= (expiresAt - 300)) {
      console.log('Session expired or expiring soon');
      return false;
    }
    
    return true;
  };

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

  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        setSessionValid(false);
        return;
      }
      
      if (data.session) {
        console.log('Session refreshed successfully');
        setSession(data.session);
        setUser(data.session.user);
        setSessionValid(true);
        
        // Fetch updated profile
        if (data.session.user) {
          const userProfile = await fetchProfile(data.session.user.id);
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSessionValid(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth event:', event, 'Session valid:', validateSession(session));
        
        setSession(session);
        setUser(session?.user ?? null);
        
        const isValid = validateSession(session);
        setSessionValid(isValid);
        
        // Fetch profile when user signs in with valid session
        if (session?.user && isValid) {
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
          
          // Handle OAuth redirect to profile page
          const isOAuthCallback = location.pathname === '/' && 
            (window.location.hash.includes('access_token') || 
             window.location.search.includes('code'));
          
          if (event === 'SIGNED_IN' && (isOAuthCallback || location.pathname === '/sign-in')) {
            setTimeout(() => {
              navigate('/profile');
            }, 100);
          }
        } else {
          if (mounted) {
            setProfile(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Get existing session and validate it
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (!mounted) return;
        
        const isValid = validateSession(session);
        console.log('Initial session check - Valid:', isValid, 'Session:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setSessionValid(isValid);
        
        if (session?.user && isValid) {
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        } else if (session && !isValid) {
          // Session exists but is invalid, try to refresh
          console.log('Attempting to refresh invalid session...');
          await refreshSession();
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
    await supabase.auth.signOut();
    setProfile(null);
    setSessionValid(false);
    navigate('/');
  };

  const value = {
    user,
    session,
    profile,
    loading,
    sessionValid,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
