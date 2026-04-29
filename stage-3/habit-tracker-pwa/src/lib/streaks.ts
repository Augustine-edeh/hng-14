export function calculateCurrentStreak(completions: string[]): number {
  if (!completions || completions.length === 0) return 0;

  const dates = completions
    .map((c) => new Date(c).getTime())
    .sort((a, b) => b - a);

  if (dates.length === 0) return 0;

  let streak = 1;
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < dates.length - 1; i++) {
    const diff = dates[i] - dates[i + 1];
    if (diff === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
