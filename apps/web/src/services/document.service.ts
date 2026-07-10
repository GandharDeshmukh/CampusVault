import { supabase } from "@/lib/supabase";
import type { Document } from "@/types/document";

export async function getDocuments(
  department?: string
) {
  let query = supabase
    .from("documents")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (department) {
    query = query.eq("department", department);
  }

  return await query;
}

export async function searchDocuments(search: string) {
  return await supabase
    .from("documents")
    .select("*")
    .ilike("title", `%${search}%`)
    .order("created_at", { ascending: false });
}

export async function uploadDocument(
  file: File,
  data: Omit<Document, "id" | "file_url" | "created_at">
) {
  const filePath = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(filePath);

  return await supabase
    .from("documents")
    .insert({
      ...data,
      file_name: file.name,
      file_url: urlData.publicUrl,
    })
    .select()
    .single();
}

export async function deleteDocument(document: Document) {
  const filePath = document.file_url.split("/documents/")[1];

  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([filePath]);

  if (storageError) {
    throw storageError;
  }

  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", document.id);

  if (dbError) {
    throw dbError;
  }
}