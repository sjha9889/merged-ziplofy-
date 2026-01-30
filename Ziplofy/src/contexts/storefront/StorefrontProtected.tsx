import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStorefrontAuth } from './storefront-auth.context';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

const StorefrontProtected: React.FC<Props> = ({ children, redirectTo = '/auth/login' }) => {
  const { user } = useStorefrontAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default StorefrontProtected;


