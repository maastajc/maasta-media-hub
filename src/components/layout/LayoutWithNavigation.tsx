
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutWithNavigationProps {
  children: React.ReactNode;
}

export function LayoutWithNavigation({ children }: LayoutWithNavigationProps) {
  // Make useAuth optional to prevent errors on public routes
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Ignore auth errors for public routes
    console.log('Auth not available for this route');
  }
  
  const location = useLocation();

  // Pages where bottom navigation should not appear
  const hiddenRoutes = ["/sign-in", "/sign-up", "/complete-profile"];
  // Show navigation on main app pages and profile-related pages
  const showNavigationRoutes = [
    "/", 
    "/profile", 
    "/artists", 
    "/auditions", 
    "/events", 
    "/dashboard", 
    "/networking",
    "/my-auditions",
    "/my-events", 
    "/my-applications",
    "/my-organizations",
    "/my-review"
  ];
  
  const isShowNavigationRoute = showNavigationRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );
  
  const shouldShowNavigation = isShowNavigationRoute && !hiddenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <div className={shouldShowNavigation ? "pb-20 md:pb-0" : ""}>
        {children}
      </div>
      {shouldShowNavigation && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
