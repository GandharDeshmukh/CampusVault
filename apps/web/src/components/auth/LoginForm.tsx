import { useState } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { signIn } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn(email, password);

      if (error) {
        alert(error.message);
      }

      // No navigate() here.
      // AuthContext will detect the session automatically.
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl p-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Welcome Back
        </h2>

        <p className="mt-2 text-muted-foreground">
          Sign in to continue to CampusVault
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(Boolean(checked))
              }
            />

            <span className="text-sm">
              Remember me
            </span>
          </div>

          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Card>
  );
}