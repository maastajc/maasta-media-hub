
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maasta-purple"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && profile?.role !== requiredRole) {
    toast.error("Access Denied", {
      description: "You do not have permission to view this page.",
    });
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

