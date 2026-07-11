import { Navigate } from "react-router-dom";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading CampusVault...
        </h2>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}