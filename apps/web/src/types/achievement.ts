export interface Achievement {
  id: string;

  student_name: string;

  title: string;

  description: string | null;

  department: string;

  event: string;

  position: string;

  certificate_name: string | null;

  certificate_url: string | null;

  uploaded_by: string | null;

  created_at: string;

  faculty_guide: string | null;

  achievement_date: string | null;

  image_urls: string[] | null;

  external_link: string | null;
}