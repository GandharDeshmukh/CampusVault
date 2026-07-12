import { supabase } from "@/lib/supabase";
import type { Achievement } from "../types/achievement";

export async function getAchievements(
  department?: string
) {
  let query = supabase
    .from("achievements")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (department) {
    query = query.eq("department", department);
  }

  return await query;
}

export async function getAchievementById(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadAchievement(
  file: File,
  data: Omit<
    Achievement,
    "id" | "certificate_url" | "created_at"
  >
) {
  const filePath = `${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("achievement-certificates")
      .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData } =
    supabase.storage
      .from("achievement-certificates")
      .getPublicUrl(filePath);

  return await supabase
    .from("achievements")
    .insert({
      ...data,
      certificate_name: file.name,
      certificate_url: urlData.publicUrl,
    })
    .select()
    .single();
}

export async function deleteAchievement(
  achievement: Achievement
) {
  const filePath =
    achievement.certificate_url.split(
      "/achievement-certificates/"
    )[1];

  await supabase.storage
    .from("achievement-certificates")
    .remove([filePath]);

  return await supabase
    .from("achievements")
    .delete()
    .eq("id", achievement.id);
}