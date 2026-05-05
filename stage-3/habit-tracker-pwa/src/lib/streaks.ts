function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function previousDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const current = new Date(Date.UTC(year, month - 1, day));
  current.setUTCDate(current.getUTCDate() - 1);
  return current.toISOString().split("T")[0];
}

export function calculateCurrentStreak(
  completions: string[],
  today = getToday(),
): number {
  if (!Array.isArray(completions) || completions.length === 0) return 0;

  const uniqueDates = new Set(completions);
  if (!uniqueDates.has(today)) return 0;

  let streak = 0;
  let cursor = today;

  while (uniqueDates.has(cursor)) {
    streak += 1;
    cursor = previousDate(cursor);
  }

  return streak;
}
