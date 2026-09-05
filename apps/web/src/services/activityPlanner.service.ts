import { supabase } from "@/lib/supabase";

import type {
  ActivityPlannerItem,
} from "@/types/activityPlanner";

export async function getActivities(
  department?: string,
  facultyId?: string
) {
  let query = supabase
    .from("activity_planner")
    .select(`
      *,
      faculty (
        name,
        designation,
        department
      )
    `)
    .order("start_date", {
      ascending: true,
    });

  if (department) {
    query = query.eq(
      "department",
      department
    );
  }

  if (facultyId) {
    query = query.eq(
      "faculty_id",
      facultyId
    );
  }

  return query;
}

export async function addActivity(
  data: Omit<
    ActivityPlannerItem,
    "id" | "created_at"
  >
) {
  const {
    data: activity,
    error,
  } = await supabase
    .from("activity_planner")
    .insert(data)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return activity;
}
export async function updateActivity(
  id: string,
  data: Partial<
    Omit<
      ActivityPlannerItem,
      "id" | "created_at"
    >
  >
) {
  const {
    data: activity,
    error,
  } = await supabase
    .from("activity_planner")
    .update(data)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return activity;
}
export async function deleteActivity(
  id: string
) {
  const { error } =
    await supabase
      .from("activity_planner")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}