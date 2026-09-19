import { supabase } from "@/lib/supabase";
import { getDepartmentOrder } from "@/utils/departments";

export interface DepartmentWithStats {
  id: string;
  name: string;
  short_name: string;
  hod: string | null;
  email: string | null;
  description: string | null;
  faculty: number;
  documents: number;
  achievements: number;
}

export async function getDepartments(): Promise<{
  data: DepartmentWithStats[] | null;
  error: Error | null;
}> {
  const { data: departments, error } = await supabase
    .from("departments")
    .select("*");

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const [
    { data: faculty, error: facultyError },
    { data: documents, error: documentsError },
    { data: achievements, error: achievementsError },
  ] = await Promise.all([
    supabase
      .from("faculty")
      .select("department_id"),

    supabase
      .from("documents")
      .select("department"),

    supabase
      .from("achievements")
      .select("department"),
  ]);

  if (facultyError) {
    return {
      data: null,
      error: facultyError,
    };
  }

  if (documentsError) {
    return {
      data: null,
      error: documentsError,
    };
  }

  if (achievementsError) {
    return {
      data: null,
      error: achievementsError,
    };
  }

  const result = departments
    .map((department) => {
      const facultyCount =
        faculty?.filter(
          (member) =>
            member.department_id === department.id
        ).length ?? 0;

      const documentCount =
        documents?.filter(
          (document) =>
            document.department?.toLowerCase() ===
            department.short_name.toLowerCase()
        ).length ?? 0;

      const achievementCount =
        achievements?.filter(
          (achievement) =>
            achievement.department?.toLowerCase() ===
            department.short_name.toLowerCase()
        ).length ?? 0;

      return {
        ...department,
        faculty: facultyCount,
        documents: documentCount,
        achievements: achievementCount,
      };
    })
    .sort(
      (a, b) =>
        getDepartmentOrder(a.short_name) -
        getDepartmentOrder(b.short_name)
    );

  return {
    data: result,
    error: null,
  };
}