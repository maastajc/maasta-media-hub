import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, Plus, Calendar, Building2, FileText, Eye, ClipboardList } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isRecruiter = profile?.role === 'recruiter';

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/f6358e1a-faf0-488f-a7d2-438fe44b2e0e.png" 
                alt="Maasta Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/artists"
              className="text-gray-700 hover:text-maasta-purple px-3 py-2 text-sm font-medium transition-colors"
            >
              Artists
            </Link>
            <Link
              to="/auditions"
              className="text-gray-700 hover:text-maasta-purple px-3 py-2 text-sm font-medium transition-colors"
            >
              Auditions
            </Link>
            <Link
              to="/events"
              className="text-gray-700 hover:text-maasta-purple px-3 py-2 text-sm font-medium transition-colors"
            >
              Events
            </Link>

            {user && isRecruiter && (
              <Link
                to="/auditions/create"
                className="bg-maasta-purple text-white hover:bg-maasta-purple/90 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Post Audition
              </Link>
            )}

            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-maasta-purple text-white">
                          {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/my-auditions')}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Auditions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-events')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      My Events
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-organizations')}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Organizations
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-applications')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Applications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-review')}>
                      <Eye className="mr-2 h-4 w-4" />
                      Review Applications
                    </DropdownMenuItem>
                    {isRecruiter && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/auditions/create')}>
                          <Plus className="mr-2 h-4 w-4" />
                          Post Audition
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-maasta-purple hover:bg-maasta-purple/90">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-maasta-purple focus:outline-none focus:text-maasta-purple"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-white shadow-lg">
              <Link
                to="/artists"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                onClick={() => setIsOpen(false)}
              >
                Artists
              </Link>
              <Link
                to="/auditions"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                onClick={() => setIsOpen(false)}
              >
                Auditions
              </Link>
              <Link
                to="/events"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>

              {user && isRecruiter && (
                <Link
                  to="/auditions/create"
                  className="block px-3 py-2 text-base font-medium text-maasta-purple bg-maasta-purple/10 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Post Audition
                </Link>
              )}

              {user ? (
                <div className="border-t pt-4 mt-4">
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-gray-800">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-auditions"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    My Auditions
                  </Link>
                  <Link
                    to="/my-events"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    My Events
                  </Link>
                  <Link
                    to="/my-organizations"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Organizations
                  </Link>
                  <Link
                    to="/my-applications"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/my-review"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Review Applications
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Link
                    to="/sign-in"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-maasta-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
