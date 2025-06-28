
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Users, Target, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-maasta-purple">Maasta</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A revolutionary platform built for the creators, by the creators.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-maasta-purple/10 to-maasta-orange/10 rounded-2xl p-8 md:p-12">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-maasta-purple mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're on a mission to democratize access to opportunities in the media and entertainment industry—connecting aspiring and professional talents with casting directors, production houses, and event organizers.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-12 h-12 text-maasta-orange mb-4" />
                <h3 className="text-xl font-semibold mb-4">All-in-One Platform</h3>
                <p className="text-gray-600 leading-relaxed">
                  From digital portfolios and audition applications to workshops and talent showcases, Maasta brings everything under one roof.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-12 h-12 text-maasta-purple mb-4" />
                <h3 className="text-xl font-semibold mb-4">For All Creatives</h3>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're an actor, dancer, filmmaker, editor, or musician, Maasta empowers you to create, connect, and grow in your creative journey.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-16">
            <div className="text-center bg-gray-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                We are building India's first superapp for the media industry—bridging the gap between tier-1 cities and rising talent across tier-2/3 towns.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Join the Creator Economy?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/sign-up" 
                className="inline-flex items-center px-6 py-3 bg-maasta-purple text-white font-medium rounded-lg hover:bg-maasta-purple/90 transition-colors"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
