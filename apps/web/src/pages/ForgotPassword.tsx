import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { sendPasswordReset } from "@/services/auth.service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await sendPasswordReset(
          email.trim()
        );

      if (error) {
        throw error;
      }

      setSent(true);

      toast.success(
        "Password reset email sent."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send reset email."
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
            Forgot Password?
          </h1>

          <p className="mt-2 text-muted-foreground">
            Enter your registered email and we'll
            send you a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm">
                We've sent a password reset link to:
              </p>

              <p className="mt-1 font-medium">
                {email}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                Check your inbox and click the
                reset link to create a new password.
              </p>
            </div>

            <Link
              to="/"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </Button>

            <Link
              to="/"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </form>
        )}
      </Card>
    </div>
  );
}