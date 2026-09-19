import { supabase } from "@/lib/supabase";
import type { Faculty } from "@/types/faculty";

const BUCKET = "faculty-photos";

async function getDepartmentId(
  department?: string
) {
  if (!department) return null;

  const { data, error } = await supabase
    .from("departments")
    .select("id")
    .ilike("short_name", department)
    .single();

  if (error) {
    console.error(
      "Failed to find department:",
      error
    );

    throw error;
  }

  return data.id;
}

export async function getFaculty(
  department?: string
) {
  let query = supabase
    .from("faculty")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (department) {
    const departmentId =
      await getDepartmentId(department);

    query = query.eq(
      "department_id",
      departmentId
    );
  }

  return query;
}

export async function uploadFaculty(
  photo: File | null,
  faculty: Omit<
    Faculty,
    | "id"
    | "created_at"
    | "updated_at"
    | "photo_url"
  >
) {
  let photo_url: string | null = null;
  let photo_name: string | null = null;

  /*
   * Convert department short name
   * into the actual department UUID.
   */

  const departmentId =
    await getDepartmentId(
      faculty.department
    );

  if (photo) {
    const fileName = `${Date.now()}-${photo.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(fileName, photo);

    if (uploadError) {
      throw uploadError;
    }

    photo_name = photo.name;

    photo_url =
      supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName)
        .data.publicUrl;
  }

  return supabase
    .from("faculty")
    .insert({
      ...faculty,

      department_id: departmentId,

      photo_name,
      photo_url,
    });
}

export async function deleteFaculty(
  faculty: Faculty
) {
  if (faculty.photo_url) {
    const fileName =
      faculty.photo_url
        .split("/")
        .pop();

    if (fileName) {
      await supabase.storage
        .from(BUCKET)
        .remove([fileName]);
    }
  }

  return supabase
    .from("faculty")
    .delete()
    .eq("id", faculty.id);
}