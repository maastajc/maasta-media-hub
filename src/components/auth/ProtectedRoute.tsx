
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If a specific role is required but the user doesn't have it, show an unauthorized message
  // This would require you to also fetch the user's role from profiles table
  // For now, we'll just return the children
  
  return <>{children}</>;
};
