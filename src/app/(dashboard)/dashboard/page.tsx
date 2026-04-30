import { createClient } from '@/lib/supabase/server';
import { calculateProgress } from '@/lib/utils/scoring';
import DashboardContent from '@/components/dashboard/dashboard-content';

// In a real app, this would query a complex materialized view or handle aggregation efficiently
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch Announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('posted_at', { ascending: false })
    .limit(3);

  // 3. Fetch stats (simplified for the seed setup)
  const [{ count: attendanceCount }, { count: quizzesCount }, { count: tasksCount }] = await Promise.all([
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('scores').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const totalExpectedDays = 30; // From 6 week curriculum
  const progressPercent = calculateProgress(
    attendanceCount || 0,
    quizzesCount || 0,
    tasksCount || 0,
    totalExpectedDays
  );

  // 4. Quick Actions logic
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  const { data: todayAttendance } = await supabase
    .from('attendance')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', todayDateStr)
    .maybeSingle();

  const { data: todayDay } = await supabase
    .from('days')
    .select('id, quizzes(id)')
    .eq('date', todayDateStr)
    .maybeSingle();

  let hasAttemptedTodayQuiz = false;
  if (todayDay?.quizzes?.[0]?.id) {
    const { data: score } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('quiz_id', todayDay.quizzes[0].id)
      .maybeSingle();
    hasAttemptedTodayQuiz = !!score;
  }

  // 5. Mock Activities (For demo, mixing attendance/scores)
  const { data: recentScores } = await supabase
    .from('scores')
    .select('attempted_at, score, quizzes(days(topic))')
    .eq('user_id', user.id)
    .order('attempted_at', { ascending: false })
    .limit(3);

  const activities = (recentScores || []).map((s: any) => ({
    id: s.attempted_at, // fake id
    type: 'quiz' as const,
    title: `Completed Quiz: ${s.quizzes?.days?.topic || 'Daily Quiz'}`,
    description: `Scored ${s.score} points`,
    date: s.attempted_at,
  }));

  return (
    <DashboardContent
      profile={profile}
      announcements={announcements || []}
      attendanceCount={attendanceCount || 0}
      quizzesCount={quizzesCount || 0}
      tasksCount={tasksCount || 0}
      progressPercent={progressPercent}
      todayAttendance={todayAttendance}
      todayDay={todayDay}
      hasAttemptedTodayQuiz={hasAttemptedTodayQuiz}
      activities={activities}
      totalExpectedDays={totalExpectedDays}
    />
  );
}
