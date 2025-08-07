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
  const shouldShowNavigation = user && !hiddenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <div className={shouldShowNavigation ? "pb-16" : ""}>
        {children}
      </div>
      {shouldShowNavigation && <BottomNavigation />}
    </div>
  );
}