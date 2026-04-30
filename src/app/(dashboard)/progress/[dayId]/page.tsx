import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getDayStatus } from '@/lib/utils/dayLock';
import DayEditDialog from '@/components/admin/day-edit-dialog';
import QuizPlayer from '@/components/quiz/quiz-player';
import ScoreCard from '@/components/quiz/score-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, ExternalLink, User, PlayCircle, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default async function DayDetailPage({ params }: { params: { dayId: string } }) {
  // Await params first to resolve the Promise
  const resolvedParams = await params;
  const dayId = resolvedParams.dayId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch Day + Quiz
  const { data: day, error } = await supabase
    .from('days')
    .select('*, quizzes(*), weeks(week_number, title)')
    .eq('id', dayId)
    .single();

  if (error || !day) notFound();

  const quiz = day.quizzes;

  // Fetch attempt
  let scoreObj = null;
  if (quiz) {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', quiz.id)
      .maybeSingle();
    scoreObj = data;
  }

  // Fetch user profile for role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const hasAttempted = !!scoreObj;
  const status = getDayStatus(day.date, hasAttempted);
  const isAdmin = profile?.role === 'admin';

  // Security: block access if locked (Admins bypass)
  if (status === 'locked' && !isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">This day is locked</h2>
        <p className="text-gray-500 mb-8">It will be available on {format(parseISO(day.date), 'MMMM d, yyyy')}</p>
        <Link href="/progress">
          <Button variant="outline">Return to Progress</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Link href="/progress" className="inline-flex items-center text-sm font-medium hover:underline mb-6" style={{ color: '#7A7268' }}>
        <ArrowLeft size={16} className="mr-1" /> Back to Curriculum
      </Link>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black font-mono px-3 py-1 rounded-lg uppercase shadow-sm" style={{ background: '#4A5DB5', color: '#FFFFFF' }}>
              Day {day.day_number}
            </span>
            <span className="text-sm font-bold text-[#7182C7]">
              {format(parseISO(day.date), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <DayEditDialog day={day}>
                <Button variant="outline" size="sm" className="rounded-xl border-blue-100 text-[#4A5DB5] font-black uppercase text-[10px] tracking-widest hover:bg-blue-50">
                  <Edit3 size={14} className="mr-2" /> Edit Module
                </Button>
              </DayEditDialog>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-blue-50 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#4A5DB5]">
                <User size={16} />
              </div>
              <span className="text-xs font-black text-[#1A1A2E]">{day.tutor_name || 'TBA'}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
          {day.topic}
        </h1>
        
        <p className="text-lg font-medium leading-relaxed max-w-3xl text-[#7182C7] mb-8">
          {day.description}
        </p>

        {day.sub_topics && (
          <div className="space-y-3 mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0ACDC]">In this module</p>
            <div className="flex flex-wrap gap-2">
              {day.sub_topics.split(';').map((topic: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-white border border-blue-50 rounded-xl text-xs font-bold text-[#4A5DB5] shadow-sm">
                  {topic.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {day.video_url && (
          <div className="w-full mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0ACDC] mb-4">Lecture Recording</p>
            {day.video_url.includes('youtube.com') || day.video_url.includes('youtu.be') ? (
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${day.video_url.split('v=')[1]?.split('&')[0] || day.video_url.split('/').pop()}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <a href={day.video_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <div className="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border transition-all hover:bg-blue-50/50 hover:border-[#4A5DB5]/30 group" style={{ borderColor: 'rgba(74,93,181,0.2)', background: 'white' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4A5DB5] text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <PlayCircle size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1A1A2E]">Session Recording</p>
                    <p className="text-[10px] font-bold text-[#4A5DB5]">Watch Video</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        )}

        <div className="w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0ACDC] mb-4">Module Insights</p>
          <div className="bg-white rounded-[2.5rem] p-10 border border-blue-50 shadow-sm leading-relaxed text-[#5A68A3] font-medium whitespace-pre-wrap">
            {day.description}
          </div>
        </div>

        {day.resource_link && (
          <a href={day.resource_link} target="_blank" rel="noopener noreferrer" className="mt-6">
            <div className="flex items-center gap-4 px-8 py-5 rounded-[2rem] border transition-all hover:bg-blue-50/50 hover:border-[#40C4D0]/30 group" style={{ borderColor: 'rgba(64,196,208,0.2)', background: 'white' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#40C4D0] text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-sm font-black text-[#1A1A2E]">Download Resources</p>
                <p className="text-[10px] font-bold text-[#40C4D0]">PDFs, Slides & Code</p>
              </div>
            </div>
          </a>
        )}
      </div>

      <div className="border-t pt-10" style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
        {!quiz ? (
          <div className="text-center py-10 bg-[#FAFAFA] rounded-2xl border" style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>No Quiz Today</h3>
            <p className="text-sm" style={{ color: '#7A7268' }}>There is no quiz assigned for this day's curriculum.</p>
          </div>
        ) : status === 'missed' && !hasAttempted ? (
          <div className="text-center py-10 bg-[#D95F5F]/5 rounded-2xl border border-[#D95F5F]/20">
            <h3 className="text-lg font-bold mb-2 text-[#D95F5F]">Quiz Expired</h3>
            <p className="text-sm" style={{ color: '#7A7268' }}>This quiz was only available on {format(parseISO(day.date), 'MMM d')}.</p>
          </div>
        ) : hasAttempted ? (
          <ScoreCard score={scoreObj.score} maxScore={quiz.max_score} />
        ) : (
          <QuizPlayer quizId={quiz.id} questions={quiz.questions} />
        )}
      </div>
    </div>
  );
}
