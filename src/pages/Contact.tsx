
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Instagram, Youtube, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-maasta-purple">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or partnership inquiries? We'd love to hear from you!
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Details */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-maasta-orange/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-maasta-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <a 
                    href="mailto:support@maasta.in" 
                    className="text-maasta-purple hover:text-maasta-purple/80 transition-colors"
                  >
                    support@maasta.in
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-maasta-purple/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-maasta-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                  <a 
                    href="tel:+918973635396" 
                    className="text-maasta-purple hover:text-maasta-purple/80 transition-colors"
                  >
                    +91 8973635396
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Maasta Talent Platform Private Ltd.<br />
                    316, Anna Incubation Center, ACT campus<br />
                    Anna University, Guindy<br />
                    Chennai, Tamil Nadu – 600025
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media & Additional Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-maasta-purple/10 to-maasta-orange/10 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Follow Us</h3>
                <p className="text-gray-600 mb-6">
                  Stay updated with the latest news, opportunities, and creative content!
                </p>
                
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/maasta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://youtube.com/@maasta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/maasta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maasta-purple focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maasta-purple focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maasta-purple focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maasta-purple focus:border-transparent"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <div className="text-center">
                <button 
                  type="submit"
                  className="bg-maasta-purple text-white px-8 py-3 rounded-lg hover:bg-maasta-purple/90 transition-colors font-medium"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
