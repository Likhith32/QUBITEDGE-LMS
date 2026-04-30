import { createClient } from '@/lib/supabase/server';
import LeaderboardContent from '@/components/leaderboard/leaderboard-content';
import { calculateLeaderboardScore } from '@/lib/utils/scoring';

export const revalidate = 0;

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch all necessary data for calculation
  const [
    { data: profiles },
    { data: attendanceData },
    { data: scoresData },
    { data: submissionsData }
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, avatar_url, domain, current_streak, role').eq('role', 'intern'),
    supabase.from('attendance').select('user_id'),
    supabase.from('scores').select('user_id, score, attempted_at'),
    supabase.from('submissions').select('user_id').eq('status', 'approved')
  ]);

  // Group attendance
  const attendanceCountMap = new Map<string, number>();
  attendanceData?.forEach(a => {
    attendanceCountMap.set(a.user_id, (attendanceCountMap.get(a.user_id) || 0) + 1);
  });

  // Group approved submissions
  const submissionCountMap = new Map<string, number>();
  submissionsData?.forEach(s => {
    submissionCountMap.set(s.user_id, (submissionCountMap.get(s.user_id) || 0) + 1);
  });

  // Group scores and calculate streaks
  const scoreTotalMap = new Map<string, number>();
  const userQuizDates = new Map<string, Set<string>>();
  
  scoresData?.forEach(s => {
    scoreTotalMap.set(s.user_id, (scoreTotalMap.get(s.user_id) || 0) + s.score);
    
    const date = new Date(s.attempted_at).toISOString().split('T')[0];
    if (!userQuizDates.has(s.user_id)) {
      userQuizDates.set(s.user_id, new Set());
    }
    userQuizDates.get(s.user_id)!.add(date);
  });

  // Calculate streaks based on consecutive days of quiz attempts
  const calculateStreak = (dates: Set<string>) => {
    if (dates.size === 0) return 0;
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const today = currentDate.toISOString().split('T')[0];
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if they attempted today or yesterday to continue the streak
    if (!dates.has(today) && !dates.has(yesterdayStr)) return 0;

    let checkDate = dates.has(today) ? new Date(currentDate) : yesterday;
    
    while (dates.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  // Calculate final leaderboard data
  const leaderboardEntries = (profiles || [])
    .filter(p => p.domain !== 'Python Development' && p.domain !== 'Full Stack Development') 
    .map(p => {
      const attendanceCount = attendanceCountMap.get(p.id) || 0;
      const totalQuizScore = scoreTotalMap.get(p.id) || 0;
      const tasksCompleted = submissionCountMap.get(p.id) || 0;
      
      // Streak based on quiz attempts
      const quizStreak = calculateStreak(userQuizDates.get(p.id) || new Set());
      
      const finalScore = calculateLeaderboardScore(totalQuizScore, attendanceCount, quizStreak);

      return {
        user_id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        domain: p.domain,
        score: finalScore,
        current_streak: quizStreak,
        tasks_completed: tasksCompleted,
      };
    });

  // Sort: 1. Score, 2. Streak, 3. Tasks
  leaderboardEntries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.current_streak !== a.current_streak) return b.current_streak - a.current_streak;
    return b.tasks_completed - a.tasks_completed;
  });
  
  const entriesWithRank = leaderboardEntries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  return (
    <LeaderboardContent 
      entries={entriesWithRank} 
      currentUserId={user.id} 
    />
  );
}
