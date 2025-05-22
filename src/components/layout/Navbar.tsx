
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/4fe9af1f-50da-4516-b1d1-a001e4effef3.png" 
                alt="Maasta Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/artists" className="text-gray-700 hover:text-maasta-orange px-3 py-2 rounded-md text-sm font-medium">Artists</Link>
            <Link to="/auditions" className="text-gray-700 hover:text-maasta-orange px-3 py-2 rounded-md text-sm font-medium">Auditions</Link>
            <Link to="/events" className="text-gray-700 hover:text-maasta-orange px-3 py-2 rounded-md text-sm font-medium">Events</Link>
            <Button className="ml-4 bg-maasta-orange hover:bg-maasta-orange/90">Sign In</Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-maasta-orange focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            <Link 
              to="/artists" 
              className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link 
              to="/auditions" 
              className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Auditions
            </Link>
            <Link 
              to="/events" 
              className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Button 
              className="w-full mt-4 bg-maasta-orange hover:bg-maasta-orange/90"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
