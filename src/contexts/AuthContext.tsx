
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { getEmailVerificationStatus, sendVerificationEmail } from '@/services/emailVerificationService';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  username?: string;
  email_verified?: boolean;
  bio?: string;
  date_of_birth?: string;
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
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, username, email_verified')
        .eq('id', userId)
        .maybeSingle();

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

  const checkEmailVerification = async (userId: string) => {
    try {
      const verificationStatus = await getEmailVerificationStatus();
      if (verificationStatus && !verificationStatus.isVerified) {
        // Only show popup on sign up page specifically
        if (location.pathname === '/sign-up') {
          setShowEmailVerification(true);
        }
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth event:', event, 'Session exists:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const userProfile = await fetchProfile(session.user.id);
              if (isMounted) {
                setProfile(userProfile);
                
                // Check email verification status only after signup
                if (userProfile && event === 'SIGNED_IN') {
                  await checkEmailVerification(session.user.id);
                }
              }
            } catch (error) {
              console.error('Error fetching profile after auth change:', error);
              if (isMounted) {
                setProfile(null);
              }
            }
            
            if (event === 'SIGNED_IN' && isMounted) {
              const isOAuthCallback = location.pathname === '/' && 
                (window.location.hash.includes('access_token') || 
                 window.location.search.includes('code'));
              
                if (isOAuthCallback || location.pathname === '/sign-in' || location.pathname === '/sign-up') {
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
          setShowEmailVerification(false);
        }
        
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 100);
      }
    );

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
              // Don't check email verification on initial load
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
      setShowEmailVerification(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      await sendVerificationEmail();
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      setIsResendingEmail(false);
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
      {user && (
        <EmailVerificationPopup
          open={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          email={user.email || ''}
          onResendEmail={handleResendEmail}
          isResending={isResendingEmail}
        />
      )}
    </AuthContext.Provider>
  );
};
