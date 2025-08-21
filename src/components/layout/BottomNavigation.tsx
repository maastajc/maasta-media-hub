
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link 
          to="/auditions" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/auditions") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs font-medium">Auditions</span>
        </Link>

        <Link 
          to="/events" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/events") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-medium">Events</span>
        </Link>

        <Link 
          to="/networking" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/networking") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs font-medium">Network</span>
        </Link>

        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/profile") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
