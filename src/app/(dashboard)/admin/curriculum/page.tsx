import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Calendar, Video, Link as LinkIcon, Edit3, Trash2, ClipboardList } from 'lucide-react';
import DayEditDialog from '@/components/admin/day-edit-dialog';

export const revalidate = 0;

export default async function AdminCurriculumPage() {
  const supabase = await createClient();

  // Fetch weeks with nested days
  const { data: weeks } = await supabase
    .from('weeks')
    .select('*, days(*)')
    .order('week_number', { ascending: true });

  // Ensure days are ordered within weeks
  const sortedWeeks = weeks?.map(week => ({
    ...week,
    days: (week.days as any[]).sort((a, b) => a.day_number - b.day_number)
  }));

  return (
    <div className="relative pb-10">
      <div className="bg-mesh opacity-20" />
      
      <div className="relative z-10">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
            Curriculum Registry
          </h1>
          <p className="text-lg font-bold text-[#7182C7]">
            Maintain and evolve the 6-week Applied AI bootcamp structure.
          </p>
        </div>

        <div className="space-y-12">
          {sortedWeeks?.map((week) => (
            <div key={week.id} className="space-y-6">
              <div className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E9EEF9] flex items-center justify-center text-[#2238A4]">
                  <Calendar size={24} />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tight">
                  Week {week.week_number}: {week.title}
                </h2>
              </div>

              <Card className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#E9EEF9]/50">
                        <TableRow className="border-b-blue-100/50">
                          <TableHead className="font-black text-[#1A1A2E] px-8 py-6 w-[100px]">Day</TableHead>
                          <TableHead className="font-black text-[#1A1A2E]">Topic & Instructor</TableHead>
                          <TableHead className="font-black text-[#1A1A2E] text-center">Resources</TableHead>
                          <TableHead className="font-black text-[#1A1A2E] text-right px-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(week.days as any[]).map((day) => (
                          <TableRow key={day.id} className="hover:bg-blue-50/30 transition-colors border-b-blue-50/50 group">
                            <TableCell className="px-8 py-6 font-black text-[#4A5DB5]">
                              Day {day.day_number}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-black text-[#1A1A2E] group-hover:text-[#2238A4] transition-colors">
                                  {day.topic}
                                </p>
                                {day.sub_topics && (
                                  <p className="text-[10px] font-bold text-[#A0ACDC] mt-0.5 italic">
                                    {day.sub_topics}
                                  </p>
                                )}
                                <p className="text-xs font-bold text-[#7182C7] flex items-center gap-1 mt-1">
                                  <span className="text-[#A0ACDC]">Instructor:</span> {day.tutor_name || 'TBA'}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-3">
                                {day.video_url && (
                                  <div className="p-2 rounded-lg bg-red-50 text-red-500" title="Video Recording Available">
                                    <Video size={16} />
                                  </div>
                                )}
                                {day.resource_link && (
                                  <div className="p-2 rounded-lg bg-blue-50 text-blue-500" title="External Resources Available">
                                    <LinkIcon size={16} />
                                  </div>
                                )}
                                {!day.video_url && !day.resource_link && (
                                  <span className="text-xs text-[#A0ACDC] font-bold">None</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <DayEditDialog day={day} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
