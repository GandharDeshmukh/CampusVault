export interface Faculty {
  id: string;

  name: string;
  department: string;

  designation: string;
  qualification: string;
  experience: number;

  email: string | null;
  phone: string | null;

  research_area: string | null;

  photo_url: string | null;
  photo_name: string | null;

  created_at: string;
  updated_at: string;
}