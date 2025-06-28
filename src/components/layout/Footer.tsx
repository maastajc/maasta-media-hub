
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img 
              src="/lovable-uploads/4fe9af1f-50da-4516-b1d1-a001e4effef3.png" 
              alt="Maasta Logo" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm mt-2">
              All-in-one media-tech platform for Tamil artists, event organizers, and producers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><Link to="/artists" className="text-sm hover:text-maasta-orange">Tamil Artist Portfolios</Link></li>
              <li><Link to="/auditions" className="text-sm hover:text-maasta-orange">Kolywood Auditions</Link></li>
              <li><Link to="/networking" className="text-sm hover:text-maasta-orange">Artist Network</Link></li>
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
