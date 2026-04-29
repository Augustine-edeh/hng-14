export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: string;
  completions: string[]; // ISO date strings
}
