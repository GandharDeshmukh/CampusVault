import { supabase } from "@/lib/supabase";

export async function getRecentDocuments() {
  return supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
}

export async function getRecentAchievements() {
  return supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
}