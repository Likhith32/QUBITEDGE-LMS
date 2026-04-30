import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();

    // 1. Delete user from auth (this will cascade delete profile due to FK constraint)
    const { error: deleteError } = await adminAuthClient.auth.admin.deleteUser(userId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
