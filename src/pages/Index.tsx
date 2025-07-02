
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
import HeroArtistSlideshow from "@/components/home/HeroArtistSlideshow";

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
        {/* Enhanced Hero Section with Desktop Optimizations */}
        <section className="relative overflow-hidden bg-gradient-to-br from-maasta-purple/5 via-white to-maasta-orange/5 py-8 md:py-16">
          {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-maasta-orange/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-maasta-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-maasta-orange/5 to-maasta-purple/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Enhanced Text Content with Reduced Font Sizes */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in leading-tight">
                  Create Your Media{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-maasta-orange via-red-500 to-maasta-purple animate-pulse">
                    Portfolio
                  </span>{" "}
                  & Apply for Verified{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-maasta-purple via-blue-500 to-maasta-orange animate-pulse">
                    Auditions
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up leading-relaxed">
                  From <strong>Kollywood</strong> to digital platforms, discover authentic casting calls and showcase your talent to Tamil cinema's finest directors and producers.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-6 animate-slide-up">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-maasta-orange to-red-500 hover:from-maasta-orange/90 hover:to-red-500/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3 text-base font-semibold"
                    onClick={handleViewAuditions}
                  >
                    Explore Auditions →
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3 text-base font-semibold"
                    onClick={handleCreateAccount}
                  >
                    Create Your Free Portfolio →
                  </Button>
                </div>

                <div className="mb-6 animate-fade-in">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-maasta-orange/10 to-maasta-purple/10 text-maasta-orange rounded-full text-sm font-medium animate-scale-in border border-maasta-orange/20">
                    Tamil Cinema's Digital Revolution
                  </span>
                </div>

                {/* Enhanced Stats Section with Tamil focus */}
                <div className="grid grid-cols-3 gap-6 animate-fade-in p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg" style={{ animationDelay: '0.5s' }}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-maasta-orange mb-1">500+</div>
                    <div className="text-xs font-medium text-gray-700">Active Artists</div>
                    <div className="text-xs text-gray-500">Ready to audition</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-2xl md:text-3xl font-bold text-maasta-purple mb-1">150+</div>
                    <div className="text-xs font-medium text-gray-700">Live Auditions</div>
                    <div className="text-xs text-gray-500">Updated daily</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">25+</div>
                    <div className="text-xs font-medium text-gray-700">Casting Directors</div>
                    <div className="text-xs text-gray-500">Verified profiles</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Visual Content with Artist Slideshow - Moved Up */}
              <div className="relative lg:ml-8 -mt-4 lg:-mt-8">
                <HeroArtistSlideshow />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Auditions Section - Moved to top after hero */}
        <RecentAuditions />

        {/* Featured Artists Section - Moved to second after hero */}
        <FeaturedArtists />

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
              Start Your Tamil Journey
            </Button>
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
