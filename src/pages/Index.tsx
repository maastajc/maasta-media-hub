
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
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
            
            {/* Floating dots */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Join 10,000+ Talented Artists
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  Your Stage
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse">
                    Awaits
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  Where talent meets opportunity. Showcase your skills, connect with industry professionals, and build your entertainment career.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 px-10 py-6 text-xl font-semibold rounded-full"
                  onClick={handleCreateAccount}
                >
                  Start Your Journey
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-10 py-6 text-xl font-semibold rounded-full"
                  onClick={() => document.getElementById('featured-content')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Opportunities
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                  <div className="text-white/70">Active Artists</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                  <div className="text-white/70">Open Auditions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
                  <div className="text-white/70">Success Stories</div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-lg text-gray-600 animate-fade-in mb-12" style={{ animationDelay: '0.2s' }}>Everything Tamil artists need to succeed in the entertainment industry</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Portfolio Building Section */}
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-maasta-orange animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-maasta-orange/10 to-maasta-orange/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-maasta-orange">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Build a Powerful Digital Portfolio</h2>
                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-medium text-gray-800">Upload your work: Photos, videos, project links</h3>
                    <h3 className="text-lg font-medium text-gray-800">Tag your skills: Actor, Director, Dancer, Editor, etc.</h3>
                    <h3 className="text-lg font-medium text-gray-800">Add your experience, education, and certifications</h3>
                  </div>
                  <div className="text-center">
                    <h4 className="inline-block">
                      <Link to="/artists" className="text-maasta-orange hover:text-maasta-orange/80 font-medium group-hover:underline transition-all duration-300 text-lg">
                        View Talent Portfolios →
                      </Link>
                    </h4>
                  </div>
                </CardContent>
              </Card>
              
              {/* Auditions Section */}
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-maasta-purple animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-maasta-purple/10 to-maasta-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-maasta-purple">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Apply for Verified Casting Calls & Auditions</h2>
                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-medium text-gray-800">Apply with one click to available auditions</h3>
                    <h3 className="text-lg font-medium text-gray-800">View detailed audition briefs before applying</h3>
                    <h3 className="text-lg font-medium text-gray-800">Portfolio auto-updates with new project entries</h3>
                  </div>
                  <div className="text-center">
                    <h4 className="inline-block">
                      <Link to="/auditions" className="text-maasta-purple hover:text-maasta-purple/80 font-medium group-hover:underline transition-all duration-300 text-lg">
                        Apply Now →
                      </Link>
                    </h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional H2 Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-16">
              {/* Discovery Section */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Be Discovered by Casting Directors and Producers</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Get discovered and share your portfolio with casting agents through our media talent discovery platform. Connect directly with industry professionals looking for fresh talent.
                </p>
                <h4>
                  <Button 
                    className="bg-gradient-to-r from-maasta-orange to-maasta-purple hover:from-maasta-orange/90 hover:to-maasta-purple/90 text-white px-8 py-3"
                    onClick={handleCreateAccount}
                  >
                    Upload Your Work →
                  </Button>
                </h4>
              </div>

              {/* Community Section */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Join a Growing Community of Indian Media Talent</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Be part of the Indian artists community and contribute to the film industry talent pool. Our portfolio sharing app connects creative professionals across the country.
                </p>
                <h4>
                  <Button 
                    variant="outline"
                    className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3"
                    onClick={handleViewAuditions}
                  >
                    Explore Auditions →
                  </Button>
                </h4>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
