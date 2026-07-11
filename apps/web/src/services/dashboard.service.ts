import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const [
    documents,
    achievements,
    faculty,
    departments,
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("achievements")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("faculty")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("departments")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    documents: documents.count ?? 0,
    achievements: achievements.count ?? 0,
    faculty: faculty.count ?? 0,
    departments: departments.count ?? 0,
  };
}