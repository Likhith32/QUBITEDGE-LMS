/**
 * Calculates overall progress percentage.
 * Formula: (attendance + quizzes + tasks) / (totalExpected * 3) * 100
 */
export function calculateProgress(
  attendanceDays: number,
  quizzesCompleted: number,
  tasksSubmitted: number,
  totalExpectedDays: number
): number {
  if (totalExpectedDays === 0) return 0;
  const total = totalExpectedDays * 3;
  const achieved = attendanceDays + quizzesCompleted + tasksSubmitted;
  return Math.round((achieved / total) * 100);
}

/**
 * Calculates leaderboard score.
 * Formula: Quiz Points + Attendance Bonus (5pts each) + Streak Bonus (streak × 2)
 */
export function calculateLeaderboardScore(
  totalQuizScore: number,
  attendanceDays: number,
  currentStreak: number
): number {
  return totalQuizScore + (attendanceDays * 5) + (currentStreak * 2);
}
