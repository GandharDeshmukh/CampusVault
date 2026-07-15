export interface Document {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  category: string;
  department: string;

  // NBA
  criterion: number | null;
  subcategory: string | null;

  uploaded_by: string;
  created_at: string;
}