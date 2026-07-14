import { supabase } from "@/lib/supabase";
import type { Achievement } from "@/types/achievement";

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

  return query;
}

export async function getAchievementById(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function uploadAchievement(
  certificate: File,
  images: File[],
  data: Omit<
    Achievement,
    | "id"
    | "created_at"
    | "certificate_name"
    | "certificate_url"
    | "image_urls"
  >
) {
  let certificateUrl: string | null = null;
  let certificateName: string | null = null;

  const imageUrls: string[] = [];

  const certificatePath =
    `${Date.now()}-${certificate.name}`;

  const { error: certificateError } =
    await supabase.storage
      .from("achievement-certificates")
      .upload(
        certificatePath,
        certificate
      );

  if (certificateError) throw certificateError;

  const { data: certificateData } =
    supabase.storage
      .from("achievement-certificates")
      .getPublicUrl(certificatePath);

  certificateUrl =
    certificateData.publicUrl;

  certificateName = certificate.name;
    for (const image of images) {
    const imagePath =
      `${Date.now()}-${image.name}`;

    const { error: imageError } =
      await supabase.storage
        .from("achievement-images")
        .upload(
          imagePath,
          image
        );

    if (imageError) throw imageError;

    const { data: imageData } =
      supabase.storage
        .from("achievement-images")
        .getPublicUrl(imagePath);

    imageUrls.push(imageData.publicUrl);
  }

  const { data: achievement, error } =
    await supabase
      .from("achievements")
      .insert({
        ...data,
        certificate_name:
          certificateName,
        certificate_url:
          certificateUrl,
        image_urls:
          imageUrls.length
            ? imageUrls
            : null,
      })
      .select()
      .single();

  if (error) throw error;

  return achievement;
}

export async function deleteAchievement(
  achievement: Achievement
) {
  if (
    achievement.certificate_url
  ) {
    const certificatePath =
      achievement.certificate_url.split(
        "/achievement-certificates/"
      )[1];

    if (certificatePath) {
      await supabase.storage
        .from(
          "achievement-certificates"
        )
        .remove([
          certificatePath,
        ]);
    }
  }

  if (
    achievement.image_urls
      ?.length
  ) {
    const imagePaths =
      achievement.image_urls
        .map((url) =>
          url.split(
            "/achievement-images/"
          )[1]
        )
        .filter(
          Boolean
        ) as string[];

    if (
      imagePaths.length
    ) {
      await supabase.storage
        .from(
          "achievement-images"
        )
        .remove(imagePaths);
    }
  }

  const { error } =
    await supabase
      .from(
        "achievements"
      )
      .delete()
      .eq(
        "id",
        achievement.id
      );

  if (error) throw error;
}