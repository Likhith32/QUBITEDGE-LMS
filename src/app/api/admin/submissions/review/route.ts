import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id, status, feedback } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('submissions')
      .update({
        status,
        feedback,
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
