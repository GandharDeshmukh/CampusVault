import type { ReactNode } from "react";
import LoginHero from "./LoginHero";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      <LoginHero />

      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}