import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutWithNavigationProps {
  children: React.ReactNode;
}

export function LayoutWithNavigation({ children }: LayoutWithNavigationProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Pages where bottom navigation should not appear
  const hiddenRoutes = ["/sign-in", "/sign-up", "/complete-profile"];
  // Show navigation on main app pages
  const showNavigationRoutes = ["/", "/profile", "/artists", "/auditions", "/events", "/dashboard", "/networking"];
  const isShowNavigationRoute = showNavigationRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );
  const shouldShowNavigation = (isShowNavigationRoute || (!hiddenRoutes.includes(location.pathname) && location.pathname !== "/")) && !hiddenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <div className={shouldShowNavigation ? "pb-20 md:pb-0" : ""}>
        {children}
      </div>
      {shouldShowNavigation && <BottomNavigation />}
    </div>
  );
}