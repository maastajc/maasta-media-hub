
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

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maasta-purple"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // For now, we'll just return the children since role checking would require
  // additional database queries to the profiles/artist_details table
  // This can be enhanced later if specific role-based access is needed
  
  return <>{children}</>;
};
