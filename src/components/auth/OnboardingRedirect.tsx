import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingRedirectProps {
  children: React.ReactNode;
}

export const OnboardingRedirect: React.FC<OnboardingRedirectProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || !user) return;

    // Skip onboarding check for auth pages and onboarding pages
    const excludedPaths = ['/sign-in', '/sign-up', '/complete-profile'];
    const isOnboardingPath = location.pathname.startsWith('/onboarding');
    
    if (excludedPaths.includes(location.pathname) || isOnboardingPath) {
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        // Check if onboarding was completed
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        
        if (onboardingCompleted === 'true') {
          return; // User has completed onboarding
        }

        // Check profile completeness in database
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, headline, date_of_birth, city, category')
          .eq('id', user.id)
          .single();

        // If essential fields are missing, redirect to onboarding
        if (!profile?.full_name || !profile?.headline || !profile?.date_of_birth || !profile?.city || !profile?.category) {
          const currentStep = localStorage.getItem('onboarding_step') || '1';
          
          switch (currentStep) {
            case '2':
              navigate('/onboarding/work-preference');
              break;
            case '3':
              navigate('/onboarding/media-portfolio');
              break;
            case '4':
              navigate('/onboarding/projects');
              break;
            case '5':
              navigate('/onboarding/online-links');
              break;
            case '6':
              navigate('/onboarding/skills-tools');
              break;
            case '7':
              navigate('/onboarding/complete');
              break;
            default:
              navigate('/onboarding/basic-info');
          }
        } else {
          // Profile is complete, mark onboarding as done
          localStorage.setItem('onboarding_completed', 'true');
          localStorage.removeItem('onboarding_step');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, loading, navigate, location.pathname]);

  return <>{children}</>;
};