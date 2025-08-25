
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="hidden md:block bg-gray-50 text-gray-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/lovable-uploads/f6358e1a-faf0-488f-a7d2-438fe44b2e0e.png" 
              alt="Maasta Logo" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm mt-2">
              All-in-one media-tech platform for Tamil artists, event organizers, and producers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Discover
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-maasta-orange">Home</Link></li>
              <li><Link to="/artists" className="text-sm hover:text-maasta-orange">Tamil Artists</Link></li>
              <li><Link to="/auditions" className="text-sm hover:text-maasta-orange">Auditions</Link></li>
              <li><Link to="/events" className="text-sm hover:text-maasta-orange">Events</Link></li>
              <li><Link to="/networking" className="text-sm hover:text-maasta-orange">Networking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              My Account
            </h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm hover:text-maasta-orange">Dashboard</Link></li>
              <li><Link to="/profile" className="text-sm hover:text-maasta-orange">Profile</Link></li>
              <li><Link to="/my-auditions" className="text-sm hover:text-maasta-orange">My Auditions</Link></li>
              <li><Link to="/my-events" className="text-sm hover:text-maasta-orange">My Events</Link></li>
              <li><Link to="/my-applications" className="text-sm hover:text-maasta-orange">My Applications</Link></li>
              <li><Link to="/my-organizations" className="text-sm hover:text-maasta-orange">Organizations</Link></li>
              <li><Link to="/my-review" className="text-sm hover:text-maasta-orange">Review Applications</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-maasta-orange">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-maasta-orange">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-maasta-orange">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-maasta-orange">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Maasta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
