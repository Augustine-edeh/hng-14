export function getHabitSlug(habitName: string): string {
  return habitName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
