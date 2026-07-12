export interface Achievement {
  id: string;

  title: string;

  student_name: string;

  department: string;

  event: string;

  position: string;

  created_at: string;

  // New fields

  description: string | null;

  faculty_guide: string | null;

  achievement_date: string | null;

  certificate_url: string | null;

  image_urls: string[] | null;

  external_link: string | null;
}