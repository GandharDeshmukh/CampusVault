import { GraduationCap } from "lucide-react";
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

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-100">
            {today}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {greeting}, {username}! 👋
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Welcome back to CampusVault. Manage accreditation documents,
            department records, faculty information and student achievements
            from one centralized platform.
          </p>
        </div>

        <div className="hidden rounded-full bg-white/15 p-6 backdrop-blur-sm md:block">
          <GraduationCap size={72} />
        </div>
      </div>
    </div>
  );
}