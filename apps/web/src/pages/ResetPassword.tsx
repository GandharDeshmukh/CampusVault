import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { supabase } from "@/lib/supabase";
import { updatePassword } from "@/services/auth.service";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && mounted) {
        setRecoveryReady(true);
      }
    }

    initializeRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" &&
          session &&
          mounted
        ) {
          setRecoveryReady(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!recoveryReady) {
      toast.error(
        "Please open the password reset link from your email."
      );
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await updatePassword(password);

      if (error) {
        throw error;
      }

      toast.success(
        "Password updated successfully."
      );

      await supabase.auth.signOut();

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Reset Password
          </h1>

          <p className="mt-2 text-muted-foreground">
            Enter your new CampusVault password.
          </p>
        </div>

        {!recoveryReady && (
          <div className="mb-6 rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Open this page using the password
              reset link sent to your email.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="password">
              New Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              disabled={!recoveryReady}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              disabled={!recoveryReady}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading || !recoveryReady
            }
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>

          <Link
            to="/"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </form>
      </Card>
    </div>
  );
}