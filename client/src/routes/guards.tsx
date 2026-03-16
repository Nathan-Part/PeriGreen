import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getDefaultDashboardPath, isAdminUser, useAuth } from '../hooks/useAuth';
import { ROUTES } from './paths';

function GuardLoader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perigreen-600" />
    </div>
  );
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <GuardLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (requireAdmin && !isAdminUser(user)) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <GuardLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultDashboardPath(user)} replace />;
  }

  return <>{children}</>;
}

export function DashboardRedirect() {
  const { user } = useAuth();
  return <Navigate to={getDefaultDashboardPath(user)} replace />;
}
