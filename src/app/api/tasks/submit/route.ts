import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { calculateStreak } from '@/lib/utils/streak';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { taskId, format, content, filePath } = await req.json();

    // Check existing submission (if any, it will update status to pending again)
    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('user_id', user.id)
      .eq('task_id', taskId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('submissions')
        .update({
          format,
          content,
          file_path: filePath,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('submissions')
        .insert({
          task_id: taskId,
          user_id: user.id,
          format,
          content,
          file_path: filePath,
          status: 'pending',
        });
    }

    // Update streak
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', user.id)
      .single();

    if (profile) {
      const { newStreak, newLongest } = calculateStreak(
        profile.current_streak,
        profile.longest_streak,
        profile.last_active_date
      );

      const todayStr = new Date().toISOString().split('T')[0];

      await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_active_date: todayStr,
        })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
