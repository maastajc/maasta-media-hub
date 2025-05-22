
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedArtists from "@/components/home/FeaturedArtists";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import RecentAuditions from "@/components/home/RecentAuditions";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in">
              The Super App for the <span className="text-maasta-orange">Media Industry</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Connect with artists, discover genuine auditions, and promote your events—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
              <Button size="lg" className="bg-maasta-orange hover:bg-maasta-orange/90">
                Join as an Artist
              </Button>
              <Button size="lg" variant="outline" className="border-maasta-purple text-maasta-purple hover:bg-maasta-purple/10">
                Post an Audition
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Our Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover border-t-4 border-t-maasta-orange">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-maasta-orange/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-maasta-orange">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Artist Portfolio</h3>
                  <p className="text-gray-600 mb-4">Create a verified profile showcasing your work with photos, videos, and social links.</p>
                  <Link to="/artists" className="text-maasta-orange hover:text-maasta-orange/80 font-medium">
                    Explore Artists →
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="card-hover border-t-4 border-t-maasta-purple">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-maasta-purple/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-maasta-purple">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Audition Platform</h3>
                  <p className="text-gray-600 mb-4">Post, discover & apply for genuine casting calls for talents and casting directors.</p>
                  <Link to="/auditions" className="text-maasta-purple hover:text-maasta-purple/80 font-medium">
                    Browse Auditions →
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="card-hover border-t-4 border-t-maasta-orange">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-maasta-orange/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-maasta-orange">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Event Platform</h3>
                  <p className="text-gray-600 mb-4">Showcase and promote media-specific events, workshops, courses, and contests.</p>
                  <Link to="/events" className="text-maasta-orange hover:text-maasta-orange/80 font-medium">
                    Discover Events →
                  </Link>
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

        {/* CTA Section */}
        <section className="py-16 bg-maasta-purple/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Maasta Community Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with industry professionals, showcase your talent, and take your career to the next level.
            </p>
            <Button size="lg" className="bg-maasta-orange hover:bg-maasta-orange/90">
              Create Your Free Account
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
