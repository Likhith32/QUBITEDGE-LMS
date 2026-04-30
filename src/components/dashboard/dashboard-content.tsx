'use client';

import { motion } from 'framer-motion';
import { Flame, Target, CalendarCheck, Trophy } from 'lucide-react';
import AnnouncementStrip from '@/components/dashboard/announcement-strip';
import StatCard from '@/components/dashboard/stat-card';
import QuickActions from '@/components/dashboard/quick-actions';
import ActivityFeed from '@/components/dashboard/activity-feed';

interface DashboardContentProps {
  profile: any;
  announcements: any[];
  attendanceCount: number;
  quizzesCount: number;
  tasksCount: number;
  progressPercent: number;
  todayAttendance: any;
  todayDay: any;
  hasAttemptedTodayQuiz: boolean;
  activities: any[];
  totalExpectedDays: number;
}

export default function DashboardContent({
  profile,
  announcements,
  attendanceCount,
  quizzesCount,
  tasksCount,
  progressPercent,
  todayAttendance,
  todayDay,
  hasAttemptedTodayQuiz,
  activities,
  totalExpectedDays,
}: DashboardContentProps) {
  return (
    <div className="relative pb-20">
      {/* Premium Background Effects */}
      <div className="bg-mesh" />
      <div className="bg-glow top-20 right-20" />
      <div className="bg-glow -bottom-40 -left-40" style={{ animationDelay: '-10s' }} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <AnnouncementStrip announcements={announcements || []} />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Explorer'} 👋
          </h1>
          <p className="text-lg font-bold text-[#7182C7]">
            Ready to continue your mastery today?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            title="Current Streak"
            value={profile?.current_streak || 0}
            subtitle={`Longest: ${profile?.longest_streak || 0}`}
            icon={Flame}
            accentColor="#7182C7"
          />
          <StatCard
            title="Mastery Progress"
            value={`${progressPercent}%`}
            icon={Target}
            accentColor="#4A5DB5"
            isProgress
            progressValue={progressPercent}
          />
          <StatCard
            title="Days Present"
            value={`${attendanceCount || 0}/${totalExpectedDays}`}
            icon={CalendarCheck}
            accentColor="#A0ACDC"
          />
          <StatCard
            title="Leaderboard Rank"
            value="--" 
            icon={Trophy}
            accentColor="#2238A4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickActions 
              hasMarkedAttendance={!!todayAttendance} 
              todayDayId={todayDay?.id}
              hasAttemptedTodayQuiz={hasAttemptedTodayQuiz}
            />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
