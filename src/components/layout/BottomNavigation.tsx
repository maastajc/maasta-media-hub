
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, Users, User, FileText, Building2, Eye, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        <Link 
          to="/dashboard" 
          className={cn(
            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
            isActive("/dashboard") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
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

        {/* Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
              (isActive("/profile") || isActive("/my-auditions") || isActive("/my-events") || 
               isActive("/my-organizations") || isActive("/my-applications") || isActive("/my-review")) 
                ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            )}>
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mb-2">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2 w-full">
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/my-auditions" className="flex items-center gap-2 w-full">
                <ClipboardList className="h-4 w-4" />
                My Auditions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-events" className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4" />
                My Events
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-organizations" className="flex items-center gap-2 w-full">
                <Building2 className="h-4 w-4" />
                Organizations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-applications" className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4" />
                Applications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-review" className="flex items-center gap-2 w-full">
                <Eye className="h-4 w-4" />
                Review
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
