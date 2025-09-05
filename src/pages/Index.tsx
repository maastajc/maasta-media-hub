
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedArtists from "@/components/home/FeaturedArtists";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import RecentAuditions from "@/components/home/RecentAuditions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";


const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewAuditions = () => {
    navigate("/auditions");
  };

  const handlePostAudition = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to post an audition",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    navigate("/auditions/create");
  };

  const handleCreateAccount = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              {/* Text Content */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Platform for{" "}
                  <span className="bg-clip-text bg-gradient-to-r from-secondary to-primary">
                    Talents
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Showcase your skills, participate in auditions, and connect with the media industry
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold"
                    onClick={handleCreateAccount}
                  >
                    Join Maasta
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold"
                    onClick={() => document.getElementById('featured-content')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Opportunities
                  </Button>
                </div>

                {/* Search Bar (Optional) */}
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search events, auditions, or artists..."
                      className="w-full px-4 py-3 rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                    />
                    <Button size="sm" className="absolute right-2 top-2 rounded-full">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Sections */}
        <div id="featured-content">
          {/* Featured Events Section */}
          <UpcomingEvents />

          {/* Featured Auditions Section */}
          <RecentAuditions />

          {/* Featured Artists Section */}
          <FeaturedArtists />
        </div>

        {/* Call to Action Banner */}
        <section className="relative py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Join thousands of talents building their career on Maasta
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with industry professionals, showcase your artistic talents, and be part of the growing entertainment ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg"
                onClick={handleCreateAccount}
              >
                Create Your Profile
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 text-lg"
                onClick={handleViewAuditions}
              >
                Find Opportunities
              </Button>
            </div>
          </div>
        </section>

        {/* SEO-Optimized Features Section - Moved to bottom */}
    
      </main>
      <Footer />
    </div>
  );
};

export default Index;
