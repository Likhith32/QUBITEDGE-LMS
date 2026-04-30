import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { CalendarCheck, Search } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAttendancePage() {
  const supabase = await createClient();

  const { data: attendance } = await supabase
    .from('attendance')
    .select('*, profiles(full_name, email, domain)')
    .order('date', { ascending: false })
    .order('checked_in_at', { ascending: false });

  return (
    <div className="relative pb-10">
      <div className="bg-mesh opacity-20" />
      
      <div className="relative z-10">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
            Attendance Registry
          </h1>
          <p className="text-lg font-bold text-[#7182C7]">
            Real-time tracking of intern participation and punctuality.
          </p>
        </div>

        <Card className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#E9EEF9]/50">
                  <TableRow className="border-b-blue-100/50">
                    <TableHead className="font-black text-[#1A1A2E] px-8 py-6">Intern</TableHead>
                    <TableHead className="font-black text-[#1A1A2E]">Category</TableHead>
                    <TableHead className="font-black text-[#1A1A2E] text-center">Date</TableHead>
                    <TableHead className="font-black text-[#1A1A2E] text-right px-8">Check-in Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!attendance || attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20">
                        <div className="flex flex-col items-center gap-4 text-[#7182C7]">
                          <CalendarCheck size={48} className="opacity-20" />
                          <p className="font-bold">No attendance records found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((entry: any) => (
                      <TableRow key={entry.id} className="hover:bg-blue-50/30 transition-colors border-b-blue-50/50">
                        <TableCell className="px-8 py-6">
                          <div>
                            <p className="font-black text-[#1A1A2E]">{entry.profiles?.full_name}</p>
                            <p className="text-xs text-[#7182C7]">{entry.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-white border border-blue-100 text-[#4A5DB5] rounded-xl text-[10px] font-black uppercase tracking-wider">
                            {entry.profiles?.domain || 'Intern'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <p className="text-sm font-black text-[#1A1A2E]">
                            {format(parseISO(entry.date), 'EEEE')}
                          </p>
                          <p className="text-[10px] font-bold text-[#A0ACDC]">
                            {format(parseISO(entry.date), 'MMM d, yyyy')}
                          </p>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black">
                              {format(parseISO(entry.checked_in_at), 'h:mm:ss a')}
                            </span>
                          </div>
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
