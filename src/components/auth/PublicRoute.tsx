
import React from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Public routes don't require any authentication checks
  return <>{children}</>;
};
