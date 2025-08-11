
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Star, Zap, Calendar } from 'lucide-react';

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Casting Calls",
      description: "Discover exclusive audition opportunities"
    },
    {
      icon: Star,
      title: "Talent Showcase",
      description: "Display your skills and portfolio"
    },
    {
      icon: Users,
      title: "Industry Connect",
      description: "Network with directors and agents"
    },
    {
      icon: Zap,
      title: "Auditions",
      description: "Apply to roles that match your talent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="container max-w-7xl mx-auto px-4 pt-8">
        <div className="flex justify-center mb-8 lg:mb-12">
          <img 
            src="/lovable-uploads/4fe9af1f-50da-4516-b1d1-a001e4effef3.png" 
            alt="Maasta Logo" 
            className="h-16 w-auto"
          />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pb-12">
        {/* Mobile Layout - Vertical Stack */}
        <div className="lg:hidden space-y-8">
          {/* Create Account Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <SignUpForm />
            </div>
          </div>

          {/* Join Maasta Section */}
          <div className="space-y-6">
            <div className="text-center">
            
              <p className="text-lg text-muted-foreground mb-2">
                Create your profile and get discovered by industry leaders!
              </p>
              <p className="text-base text-muted-foreground">
                Connect with top casting directors, agents, and event organizers
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-maasta-purple/10 hover:border-maasta-purple/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-maasta-purple-light/30 group-hover:bg-maasta-purple/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-maasta-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Join thousands of artists already on Maasta
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal Alignment */}
        <div className="hidden lg:flex lg:items-start lg:justify-between lg:gap-16">
          {/* Left side - Join Maasta content */}
          <div className="flex-1 max-w-2xl space-y-8">
            <div className="text-left">
            
              <p className="text-xl text-muted-foreground mb-2">
                Create your profile and get discovered by industry leaders!
              </p>
              <p className="text-lg text-muted-foreground">
                Connect with top casting directors, agents, and event organizers
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-maasta-purple/10 hover:border-maasta-purple/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-maasta-purple-light/30 group-hover:bg-maasta-purple/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-maasta-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-left">
              <p className="text-muted-foreground">
                Join thousands of artists already on Maasta
              </p>
            </div>
          </div>

          {/* Right side - Create Account Form */}
          <div className="flex-shrink-0 w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
