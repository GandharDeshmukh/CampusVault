import { useEffect, useState } from "react";

import {
  FileText,
  Trophy,
  Building2,
  GraduationCap,
} from "lucide-react";

import { getDashboardStats } from "@/services/dashboard.service";

import StatsCard from "./StatsCard";

interface DashboardStats {
  documents: number;
  achievements: number;
  faculty: number;
  departments: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats>({
    documents: 0,
    achievements: 0,
    faculty: 0,
    departments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const data = await getDashboardStats();
    setStats(data);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Documents"
        value={stats.documents}
        icon={FileText}
        color="#2563EB"
        change="Documents stored"
      />

      <StatsCard
        title="Achievements"
        value={stats.achievements}
        icon={Trophy}
        color="#F59E0B"
        change="Achievements recorded"
      />

      <StatsCard
        title="Faculty"
        value={stats.faculty}
        icon={GraduationCap}
        color="#7C3AED"
        change="Faculty members"
      />

      <StatsCard
        title="Departments"
        value={stats.departments}
        icon={Building2}
        color="#10B981"
        change="Active departments"
      />
    </div>
  );
}