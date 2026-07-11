import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
  <h1 className="text-4xl font-bold">
    CampusVault
  </h1>

  <p className="mt-3 text-muted-foreground">
    Loading...
  </p>

  <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
</div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}