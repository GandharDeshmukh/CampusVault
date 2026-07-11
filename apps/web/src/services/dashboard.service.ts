import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const { count } = await supabase
    .from("documents")
    .select("*", {
      count: "exact",
      head: true,
    });

  return {
    documents: count ?? 0,
    departments: 5,
    achievements: null,
    faculty: null,
  };
}