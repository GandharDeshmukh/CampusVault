export interface ActivityPlannerItem {
  id: string;
  title: string;
  description: string | null;

  activity_type: string;

  start_date: string;
  end_date: string | null;

  start_time: string | null;
  end_time: string | null;

  venue: string | null;

  department: string | null;
  faculty_id: string | null;

  status: string;

  created_by: string | null;
  created_at: string;
}