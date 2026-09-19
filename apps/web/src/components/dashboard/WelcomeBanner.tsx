import { CalendarDays } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const username =
    user?.email?.split("@")[0] ?? "Administrator";

  const displayName =
    username.charAt(0).toUpperCase() +
    username.slice(1);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{today}</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {greeting}, {displayName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Welcome back to CampusVault. Manage institutional
            documents, departments, faculty information,
            achievements, academic activities and accreditation
            records from one centralized platform.
          </p>
        </div>

        <div className="hidden text-right md:block">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            CampusVault
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Institutional Management Portal
          </p>
        </div>
      </div>
    </div>
  );
}