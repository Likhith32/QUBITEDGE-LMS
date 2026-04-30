import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import UserCreateDialog from '@/components/admin/user-create-dialog';
import UserActions from '@/components/admin/user-actions';
import { Users, Mail, MapPin, Search } from 'lucide-react';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'intern')
    .order('created_at', { ascending: false });

  return (
    <div className="relative pb-10">
      <div className="bg-mesh opacity-20" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
              Intern Management
            </h1>
            <p className="text-lg font-bold text-[#7182C7]">
              Oversee talent acquisition and monitor individual performance.
            </p>
          </div>
          <UserCreateDialog />
        </div>

        <Card className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#E9EEF9]/50">
                  <TableRow className="border-b-blue-100/50">
                    <TableHead className="font-black text-[#1A1A2E] px-8 py-6">Intern Profile</TableHead>
                    <TableHead className="font-black text-[#1A1A2E]">Category</TableHead>
                    <TableHead className="font-black text-[#1A1A2E] text-center">Current Streak</TableHead>
                    <TableHead className="font-black text-[#1A1A2E] text-right">Joined Date</TableHead>
                    <TableHead className="font-black text-[#1A1A2E] text-right px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!users || users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <div className="flex flex-col items-center gap-4 text-[#7182C7]">
                          <Users size={48} className="opacity-20" />
                          <p className="font-bold">No interns have been registered yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors border-b-blue-50/50">
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-[#4A5DB5] font-black shadow-sm">
                              {user.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-black text-[#1A1A2E]">{user.full_name}</p>
                              <p className="text-xs text-[#7182C7] flex items-center gap-1">
                                <Mail size={12} /> {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-[#4A5DB5] text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-500/20">
                            {user.domain || 'Standard Intern'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                            <span className="text-sm font-black">🔥 {user.current_streak}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold text-[#7182C7]">
                          {format(parseISO(user.created_at), 'MMMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <UserActions user={user} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
