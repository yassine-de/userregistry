import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth";

export function ConfirmedRoute({ children }: { children: ReactNode }) {
  const { loading, user, isConfirmed } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader" aria-label="Laden"><span /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isConfirmed) return <Navigate to="/check-email" replace />;
  return children;
}
