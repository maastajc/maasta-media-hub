
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

  const handleJoinAsArtist = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/sign-up");
    }
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
        {/* Enhanced Hero Section with Tamil Nadu Artists */}
        <section className="relative overflow-hidden bg-gradient-to-br from-maasta-purple/5 via-white to-maasta-orange/5 py-20 md:py-32">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-maasta-orange/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-maasta-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-maasta-orange/5 to-maasta-purple/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6 animate-fade-in">
                  <span className="inline-block px-4 py-2 bg-maasta-orange/10 text-maasta-orange rounded-full text-sm font-medium mb-4 animate-scale-in">
                    🎭 Welcome to the Future of Tamil Media
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in leading-tight">
                  The Super App for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-maasta-orange to-maasta-purple animate-pulse">
                    Tamil Artists
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up">
                  Empowering Tamil artists from Chennai to Coimbatore, connecting talent with opportunities across Tamil Nadu and beyond.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-slide-up">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-maasta-orange to-maasta-orange/90 hover:from-maasta-orange/90 hover:to-maasta-orange text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleJoinAsArtist}
                  >
                    <span className="flex items-center gap-2">
                      🎭 Join as Tamil Artist
                    </span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handlePostAudition}
                  >
                    <span className="flex items-center gap-2">
                      📢 Post an Audition
                    </span>
                  </Button>
                </div>

                {/* Enhanced Stats Section with Tamil focus */}
                <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-maasta-orange">500+</div>
                    <div className="text-sm text-gray-600">Tamil Artists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-maasta-purple">200+</div>
                    <div className="text-sm text-gray-600">Active Auditions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-maasta-orange">50+</div>
                    <div className="text-sm text-gray-600">Production Houses</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Visual Content with Tamil Artists */}
              <div className="relative lg:ml-8">
                {/* Main Hero Image Container - Using uploaded image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-maasta-orange/20 to-maasta-purple/20 rounded-3xl blur-xl transform rotate-3 animate-pulse"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                    <img 
                      src="/lovable-uploads/df74f021-0d9a-46ae-9655-df4ed65824da.png" 
                      alt="Tamil film production scene with director and actors" 
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-semibold">Showcase Tamil Talent</div>
                      <div className="text-sm opacity-90">Connect with Tamil cinema</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 transform rotate-6 hover:rotate-12 transition-transform duration-300 animate-fade-in border-l-4 border-maasta-orange" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live Kolywood Auditions</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 transform -rotate-6 hover:-rotate-12 transition-transform duration-300 animate-fade-in border-l-4 border-maasta-purple" style={{ animationDelay: '1.2s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-maasta-orange to-maasta-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🎬</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Tamil Film Casting</div>
                      <div className="text-xs text-gray-500">Starting soon</div>
                    </div>
                  </div>
                </div>

                {/* Entertainment Industry Decorative Elements */}
                <div className="absolute top-1/4 -left-8 w-16 h-16 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl">🎭</span>
                </div>
                <div className="absolute bottom-1/4 -right-8 w-12 h-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '1.5s' }}>
                  <span className="text-xl">💃</span>
                </div>

                {/* Additional Tamil Entertainment Elements */}
                <div className="absolute top-1/2 right-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🎬</span>
                </div>
                
                <div className="absolute bottom-1/3 left-4 w-14 h-14 bg-maasta-orange/10 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '2s' }}>
                  <span className="text-xl">🎤</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section - Removed Event Platform */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Platform Features</h2>
              <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>Everything Tamil artists need to succeed in the entertainment industry</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-maasta-orange animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-maasta-orange/10 to-maasta-orange/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-maasta-orange">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center">Tamil Artist Portfolio</h3>
                  <p className="text-gray-600 mb-6 text-center leading-relaxed">Create a comprehensive verified profile showcasing your Tamil cinema work, classical performances, and artistic journey with photos, videos, and social media links.</p>
                  <div className="text-center">
                    <Link to="/artists" className="text-maasta-orange hover:text-maasta-orange/80 font-medium group-hover:underline transition-all duration-300 text-lg">
                      Explore Tamil Artists →
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-maasta-purple animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-maasta-purple/10 to-maasta-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-maasta-purple">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center">Kolywood Audition Platform</h3>
                  <p className="text-gray-600 mb-6 text-center leading-relaxed">Discover and apply for genuine casting calls from verified Tamil production houses, directors, and casting agents across Tamil Nadu and Tamil cinema worldwide.</p>
                  <div className="text-center">
                    <Link to="/auditions" className="text-maasta-purple hover:text-maasta-purple/80 font-medium group-hover:underline transition-all duration-300 text-lg">
                      Browse Tamil Auditions →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Artists Section */}
        <FeaturedArtists />

        {/* Recent Auditions Section */}
        <RecentAuditions />

        {/* Upcoming Events Section */}
        <UpcomingEvents />

        {/* Enhanced CTA Section with Tamil Focus */}
        <section className="relative py-20 bg-gradient-to-r from-maasta-purple/10 via-white to-maasta-orange/10 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-maasta-orange/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-maasta-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=120&h=120&fit=crop&crop=center" 
                alt="Tamil cultural heritage" 
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Join the Tamil Creative Community Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Connect with Tamil industry professionals, showcase your artistic talents, and be part of the growing Tamil entertainment ecosystem.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-maasta-orange to-maasta-purple hover:from-maasta-orange/90 hover:to-maasta-purple/90 text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl animate-fade-in px-8 py-4 text-lg"
              style={{ animationDelay: '0.4s' }}
              onClick={handleCreateAccount}
            >
              <span className="flex items-center gap-2">
                ✨ Start Your Tamil Journey
              </span>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
