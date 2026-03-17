import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
    </div>
  );
}

/** Accessible uniquement aux utilisateurs connectés */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Accessible uniquement aux administrateurs (ROLE_ADMIN) */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  if (!isAdmin) return <Navigate to="/espace" replace />;
  return <>{children}</>;
}

/** Accessible uniquement aux utilisateurs (ROLE_USER, pas admin) */
export function UserRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  if (isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
