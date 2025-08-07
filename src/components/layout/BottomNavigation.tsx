import { Users, Film, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    icon: Users,
    label: "Artists",
    href: "/artists",
    description: "Discover talent"
  },
  {
    icon: Film,
    label: "Auditions", 
    href: "/auditions",
    description: "Find casting calls"
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile", 
    description: "Your portfolio"
  }
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <nav className="flex items-center justify-around py-3 px-4 safe-area-inset-bottom">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          (item.href === "/artists" && location.pathname.startsWith("/artists")) ||
                          (item.href === "/auditions" && location.pathname.startsWith("/auditions"));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-maasta-purple bg-maasta-purple/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-maasta-purple")} />
              <span className={cn(
                "text-xs font-medium truncate",
                isActive && "text-maasta-purple"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}