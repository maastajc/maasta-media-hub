
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionDebug } from "@/components/ui/session-debug";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, sessionValid } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/4fe9af1f-50da-4516-b1d1-a001e4effef3.png" 
                  alt="Maasta Logo" 
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-maasta-purple">Maasta</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-maasta-purple ${
                  isActive('/') ? 'text-maasta-purple border-b-2 border-maasta-purple pb-1' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/auditions"
                className={`text-sm font-medium transition-colors hover:text-maasta-purple ${
                  isActive('/auditions') ? 'text-maasta-purple border-b-2 border-maasta-purple pb-1' : 'text-gray-700'
                }`}
              >
                Auditions
              </Link>
              <Link
                to="/artists"
                className={`text-sm font-medium transition-colors hover:text-maasta-purple ${
                  isActive('/artists') ? 'text-maasta-purple border-b-2 border-maasta-purple pb-1' : 'text-gray-700'
                }`}
              >
                Artists
              </Link>
              <Link
                to="/networking"
                className={`text-sm font-medium transition-colors hover:text-maasta-purple ${
                  isActive('/networking') ? 'text-maasta-purple border-b-2 border-maasta-purple pb-1' : 'text-gray-700'
                }`}
              >
                Network
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.profile_picture_url} alt={profile?.full_name} />
                            <AvatarFallback>
                              {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Mobile Menu Button */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-maasta-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-maasta-purple"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-2">
                    <Link to="/sign-in">
                      <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link to="/sign-up">
                      <Button size="sm" className="bg-maasta-purple hover:bg-maasta-purple/90">Sign Up</Button>
                    </Link>
                  </div>
                  
                  {/* Mobile Menu Button for Non-Authenticated */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-maasta-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-maasta-purple"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') ? 'text-maasta-purple bg-maasta-purple/10' : 'text-gray-700 hover:text-maasta-purple hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/auditions"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/auditions') ? 'text-maasta-purple bg-maasta-purple/10' : 'text-gray-700 hover:text-maasta-purple hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Auditions
              </Link>
              <Link
                to="/artists"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/artists') ? 'text-maasta-purple bg-maasta-purple/10' : 'text-gray-700 hover:text-maasta-purple hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Artists
              </Link>
              <Link
                to="/networking"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/networking') ? 'text-maasta-purple bg-maasta-purple/10' : 'text-gray-700 hover:text-maasta-purple hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Network
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={profile?.profile_picture_url} alt={profile?.full_name} />
                        <AvatarFallback>
                          {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {profile?.full_name || 'User'}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-maasta-purple hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-maasta-purple hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-maasta-purple hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link
                    to="/sign-in"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-maasta-purple hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-maasta-purple text-white hover:bg-maasta-purple/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Session Debug Component - only shows when there are issues */}
      {!sessionValid && user && (
        <div className="bg-orange-50 border-b border-orange-200 p-2">
          <div className="container max-w-7xl mx-auto">
            <SessionDebug />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
