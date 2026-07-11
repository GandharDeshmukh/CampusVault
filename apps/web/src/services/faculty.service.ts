import { supabase } from "@/lib/supabase";
import type { Faculty } from "@/types/faculty";

const BUCKET = "faculty-photos";

export async function getFaculty(department?: string) {
  let query = supabase
    .from("faculty")
    .select("*")
    .order("created_at", { ascending: false });

  if (department) {
    query = query.eq("department", department);
  }

  return query;
}

export async function uploadFaculty(
  photo: File | null,
  faculty: Omit<
    Faculty,
    "id" | "created_at" | "updated_at" | "photo_url"
  >
) {
  let photo_url: string | null = null;
  let photo_name: string | null = null;

  if (photo) {
    const fileName = `${Date.now()}-${photo.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(fileName, photo);

    if (uploadError) throw uploadError;

    photo_name = photo.name;

    photo_url = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName).data.publicUrl;
  }

  return supabase.from("faculty").insert({
    ...faculty,
    photo_name,
    photo_url,
  });
}

export async function deleteFaculty(
  faculty: Faculty
) {
  if (faculty.photo_url) {
    const fileName = faculty.photo_url.split("/").pop();

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