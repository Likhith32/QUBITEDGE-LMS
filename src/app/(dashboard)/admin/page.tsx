import { createClient } from '@/lib/supabase/server';
import AdminDashboardContent from '@/components/admin/admin-dashboard-content';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Basic stats
  const [
    { count: usersCount },
    { count: submissionsCount },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'intern'),
    supabase.from('submissions').select('*', { count: 'exact', head: true }),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return (
    <AdminDashboardContent 
      usersCount={usersCount || 0}
      submissionsCount={submissionsCount || 0}
      pendingCount={pendingCount || 0}
    />
  );
}
