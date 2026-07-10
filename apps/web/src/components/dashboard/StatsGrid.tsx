import {
  FileText,
  Trophy,
  Building2,
  Users,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function StatsGrid() {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Documents"
        value="245"
        icon={FileText}
        color="#2563EB"
        change="+18 this month"
      />

      <StatsCard
        title="Achievements"
        value="87"
        icon={Trophy}
        color="#F59E0B"
        change="+12 this month"
      />

      <StatsCard
        title="Departments"
        value="12"
        icon={Building2}
        color="#10B981"
        change="All Active"
      />

      <StatsCard
        title="Users"
        value="564"
        icon={Users}
        color="#7C3AED"
        change="+24 this week"
      />
    </div>
  );
}