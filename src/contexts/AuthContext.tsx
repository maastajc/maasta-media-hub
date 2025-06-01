import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthSession, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: AuthSession | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { full_name: string; role?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const ensureProfileExists = async (userId: string, email: string, fullName?: string) => {
    try {
      console.log("Ensuring profile exists for user:", userId);
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        console.log("Profile doesn't exist, creating one...");
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: fullName || email.split('@')[0] || 'User',
            email: email,
            role: 'artist'
          });

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
        console.log("Profile created successfully");
      } else if (profileError) {
        console.error("Error checking profile:", profileError);
        throw profileError;
      } else {
        console.log("Profile already exists:", existingProfile);
      }
    } catch (error) {
      console.error("Error in ensureProfileExists:", error);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: 'Session Error',
          description: 'Failed to retrieve your session',
          variant: 'destructive',
        });
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Ensure profile exists for existing session
        if (data.session?.user) {
          await ensureProfileExists(
            data.session.user.id, 
            data.session.user.email || '',
            data.session.user.user_metadata?.full_name
          );
        }
      }

      setLoading(false);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event);
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Ensure profile exists when user signs in
          if (event === 'SIGNED_IN' && newSession?.user) {
            await ensureProfileExists(
              newSession.user.id, 
              newSession.user.email || '',
              newSession.user.user_metadata?.full_name
            );
          }
          
          setLoading(false);
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [toast]);

  const signUp = async (
    email: string, 
    password: string, 
    userData?: { full_name: string; role?: string }
  ): Promise<void> => {
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Ensure profile is created for new user
      if (data.user) {
        await ensureProfileExists(
          data.user.id, 
          email.trim(), 
          userData?.full_name
        );
      }

      toast({
        title: 'Success!',
        description: 'Please check your email to confirm your account',
      });
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Ensure profile exists for signed in user
      if (data.user) {
        await ensureProfileExists(
          data.user.id, 
          email.trim(), 
          data.user.user_metadata?.full_name
        );
      }

      toast({
        title: 'Welcome Back!',
        description: 'You have been successfully signed in.',
      });
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Sign Out Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
