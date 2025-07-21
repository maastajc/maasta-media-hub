
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { getEmailVerificationStatus, sendVerificationEmail } from '@/services/emailVerificationService';
import ProfileStrengthPopup from '@/components/profile/ProfileStrengthPopup';
import { fetchArtistById } from '@/services/artist/artistById';

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
  const [showProfileStrengthPopup, setShowProfileStrengthPopup] = useState(false);
  const [artistProfile, setArtistProfile] = useState<any>(null);
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

  const checkProfileStrength = async (userId: string) => {
    try {
      // Check if user has permanently skipped the popup
      const popupSkipped = localStorage.getItem('profile_strength_popup_skipped');
      if (popupSkipped === 'true') {
        return; // Don't show popup if permanently skipped
      }

      // Check if user has dismissed the reminder recently (within 24 hours)
      const lastDismissed = localStorage.getItem('profile_reminder_dismissed');
      if (lastDismissed) {
        const timeDiff = Date.now() - parseInt(lastDismissed);
        const hoursPassed = timeDiff / (1000 * 60 * 60);
        if (hoursPassed < 24) {
          return; // Don't show popup if dismissed recently
        }
      }

      const artist = await fetchArtistById(userId);
      if (artist) {
        setArtistProfile(artist);
        
        // Calculate basic profile strength to determine if popup should show
        const hasBasicInfo = !!(artist.full_name && artist.bio && artist.phone_number);
        const hasMedia = !!(artist.media_assets && artist.media_assets.length > 0);
        const hasProjects = !!(artist.projects && artist.projects.length > 0);
        const hasProfilePic = !!artist.profile_picture_url;
        
        const completedSections = [hasBasicInfo, hasMedia, hasProjects, hasProfilePic].filter(Boolean).length;
        const basicStrength = (completedSections / 4) * 100;
        
        // Only show popup if profile strength is less than 100%, user is on dashboard/home, 
        // and they haven't completed onboarding (to avoid showing during onboarding flow)
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        if (basicStrength < 100 && 
            (location.pathname === '/' || location.pathname === '/dashboard') && 
            onboardingCompleted === 'true') {
          setShowProfileStrengthPopup(true);
        }
      }
    } catch (error) {
      console.error('Error checking profile strength:', error);
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
                  // Also check profile strength on login
                  setTimeout(() => {
                    checkProfileStrength(session.user.id);
                  }, 2000); // Delay to let user settle in
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
                    // Check if onboarding is completed, otherwise redirect to onboarding
                    const onboardingCompleted = localStorage.getItem('onboarding_completed');
                    if (onboardingCompleted === 'true') {
                      navigate('/profile');
                    } else {
                      navigate('/onboarding/basic-info');
                    }
                  }
                }, 100);
              }
            }
          }, 0);
        } else if (!session) {
          setProfile(null);
          setShowEmailVerification(false);
          setShowProfileStrengthPopup(false);
          setArtistProfile(null);
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
      setShowProfileStrengthPopup(false);
      setArtistProfile(null);
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
        <>
          <EmailVerificationPopup
            open={showEmailVerification}
            onClose={() => setShowEmailVerification(false)}
            email={user.email || ''}
            onResendEmail={handleResendEmail}
            isResending={isResendingEmail}
          />
          <ProfileStrengthPopup
            artist={artistProfile}
            open={showProfileStrengthPopup}
            onClose={() => {
              setShowProfileStrengthPopup(false);
              // Clear artist profile to prevent showing again
              setArtistProfile(null);
            }}
          />
        </>
      )}
    </AuthContext.Provider>
  );
};
