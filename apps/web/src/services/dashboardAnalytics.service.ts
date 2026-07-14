import { supabase } from "@/lib/supabase";

export async function getMonthlyAchievements() {
  const { data, error } = await supabase
    .from("achievements")
    .select("achievement_date");

  if (error) throw error;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const counts = new Array(12).fill(0);

  (data ?? []).forEach((item) => {
    if (!item.achievement_date) return;

    const month = new Date(item.achievement_date).getMonth();
    counts[month]++;
  });

  return months.map((month, index) => ({
    month,
    achievements: counts[index],
  }));
}