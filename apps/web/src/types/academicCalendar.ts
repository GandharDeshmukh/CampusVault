export interface AcademicCalendarEvent {
  id: string;
  academic_year: string;
  semester: string;
  activity: string;
  description: string | null;
  event_type: string | null;
  start_date: string;
  end_date: string | null;
  department: string | null;
  source_file: string | null;
  created_by: string | null;
  created_at: string;
}