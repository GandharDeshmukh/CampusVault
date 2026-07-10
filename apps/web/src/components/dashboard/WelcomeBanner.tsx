import { GraduationCap } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-100">
            CampusVault
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mt-3 max-w-xl text-blue-100">
            Manage documents, student achievements, departments and
            accreditation records from one centralized platform.
          </p>
        </div>

        <div className="hidden rounded-full bg-white/15 p-6 backdrop-blur-sm md:block">
          <GraduationCap size={72} />
        </div>
      </div>
    </div>
  );
}