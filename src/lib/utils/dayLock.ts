import { format, isToday, isBefore, isAfter, parseISO } from 'date-fns';

export type DayLockStatus = 'locked' | 'active' | 'completed' | 'missed' | 'expired';

/**
 * Determines the lock status of a day based on its calendar date and whether the user has attempted the quiz.
 */
export function getDayStatus(
  dayDate: string,
  hasAttempted: boolean
): DayLockStatus {
  const date = parseISO(dayDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isToday(date)) {
    return hasAttempted ? 'completed' : 'active';
  }

  if (isBefore(date, today)) {
    return hasAttempted ? 'completed' : 'missed';
  }

  if (isAfter(date, today)) {
    return 'locked';
  }

  return 'locked';
}

/**
 * Returns a human-readable label for a given day lock status.
 */
export function getDayStatusLabel(
  status: DayLockStatus,
  dayDate: string,
  score?: number,
  maxScore?: number
): string {
  switch (status) {
    case 'locked':
      return `🔒 Locked — Opens ${format(parseISO(dayDate), 'MMM d')}`;
    case 'active':
      return '📝 Attempt Today\'s Quiz';
    case 'completed':
      return score !== undefined && maxScore !== undefined
        ? `✅ Completed — ${score}/${maxScore}`
        : '✅ Completed';
    case 'missed':
      return '❌ Missed — Expired';
    default:
      return '';
  }
}

/**
 * Server-side validation: checks if a quiz can be attempted today.
 */
export function canAttemptQuiz(dayDate: string): boolean {
  return isToday(parseISO(dayDate));
}
