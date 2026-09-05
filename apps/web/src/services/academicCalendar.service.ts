import { supabase } from "@/lib/supabase";

import type { AcademicCalendarEvent } from "@/types/academicCalendar";

export async function getAcademicCalendar(
  academicYear?: string,
  semester?: string,
  department?: string
) {
  let query = supabase
    .from("academic_calendar")
    .select("*")
    .order("start_date", {
      ascending: true,
    });

  if (academicYear) {
    query = query.eq(
      "academic_year",
      academicYear
    );
  }

  if (semester) {
    query = query.eq(
      "semester",
      semester
    );
  }

  if (department) {
    query = query.or(
      `department.is.null,department.eq.${department}`
    );
  }

  return query;
}

export async function addAcademicCalendarEvent(
  data: Omit<
    AcademicCalendarEvent,
    "id" | "created_at"
  >
) {
  const { data: event, error } =
    await supabase
      .from("academic_calendar")
      .insert(data)
      .select()
      .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return null;
    }

    throw error;
  }

  return event;
}

export async function deleteAcademicCalendarEvent(
  id: string
) {
  const { error } =
    await supabase
      .from("academic_calendar")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}