import { useEffect, useState } from "react";

import {
  Laptop,
  Monitor,
  Radio,
  Brain,
  Cpu,
  Building2,
} from "lucide-react";

import DepartmentCard from "./DepartmentCard";

import {
  getDepartments,
  type DepartmentWithStats,
} from "@/services/department.service";

const departmentIcons: Record<
  string,
  React.ReactNode
> = {
  CE: <Laptop />,
  IT: <Monitor />,
  ENTC: <Radio />,
  "AI&DS": <Brain />,
  "E&CE": <Cpu />,
};

const departmentColors: Record<string, string> = {
  CE: "#34D399",      // light green
  ENTC: "#6D28D9",    // deeper purple
  IT: "#2563EB",      // blue
  "AI&DS": "#F59E0B", // yellow
  "E&CE": "#F97316",  // orange
};

export default function DepartmentGrid() {
  const [departments, setDepartments] =
    useState<DepartmentWithStats[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    setLoading(true);

    const { data, error } = await getDepartments();

    if (error) {
      console.error(
        "Failed to load departments:",
        error
      );

      setLoading(false);
      return;
    }

    setDepartments(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Loading departments...
        </p>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="rounded-2xl border bg-card py-16 text-center">
        <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />

        <h3 className="mt-3 font-semibold">
          No departments found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a department to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {departments.map((department) => (
        <DepartmentCard
          key={department.id}
          id={department.id}
          name={department.name}
          shortName={department.short_name}
          icon={
            departmentIcons[
              department.short_name
            ] ?? <Building2 />
          }
          color={
            departmentColors[
              department.short_name
            ] ?? "#64748B"
          }
          faculty={department.faculty}
          documents={department.documents}
          achievements={department.achievements}
        />
      ))}
    </div>
  );
}