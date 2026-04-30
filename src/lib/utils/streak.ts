import { isYesterday, parseISO, isToday } from 'date-fns';

/**
 * Calculates the updated streak values based on the user's last active date.
 * A qualifying activity: attendance, quiz attempt, or task submission.
 */
export function calculateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string | null
): { newStreak: number; newLongest: number } {
  if (!lastActiveDate) {
    // First activity ever
    return { newStreak: 1, newLongest: Math.max(1, longestStreak) };
  }

  const lastDate = parseISO(lastActiveDate);

  // Already active today — no change
  if (isToday(lastDate)) {
    return { newStreak: currentStreak, newLongest: longestStreak };
  }

  // Was active yesterday — increment streak
  if (isYesterday(lastDate)) {
    const newStreak = currentStreak + 1;
    return { newStreak, newLongest: Math.max(newStreak, longestStreak) };
  }

  // Missed a day — reset streak
  return { newStreak: 1, newLongest: longestStreak };
}
