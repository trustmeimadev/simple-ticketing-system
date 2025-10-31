export interface User {
  id: string;
  email: string | null;
  [key: string]: any;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  progress_date: string;
  tasks_completed: number;
  hours_worked: number;
  notes: string | null;
  mood: string;
  updated_at?: string;
}
