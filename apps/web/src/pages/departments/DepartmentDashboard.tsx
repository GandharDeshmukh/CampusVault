import { useParams } from "react-router-dom";
import {
  FileText,
  Trophy,
  Users,
  BarChart3,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

export default function DepartmentDashboard() {
  const { department } = useParams();

  const departmentNames: Record<string, string> = {
    ce: "Computer Engineering",
    it: "Information Technology",
    entc: "Electronics & Telecommunication",
    aids: "Artificial Intelligence & Data Science",
    ece: "Electronics & Computer Engineering",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          {departmentNames[department ?? ""] ?? "Department"}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Department Overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Documents"
          value={245}
          icon={FileText}
          color="#2563EB"
          change="+12 this month"
        />

        <StatsCard
          title="Achievements"
          value={83}
          icon={Trophy}
          color="#F59E0B"
          change="+8 this month"
        />

        <StatsCard
          title="Faculty"
          value={28}
          icon={Users}
          color="#10B981"
          change="Active"
        />

        <StatsCard
          title="Analytics"
          value="92%"
          icon={BarChart3}
          color="#7C3AED"
          change="Performance"
        />
      </div>
    </div>
  );
}