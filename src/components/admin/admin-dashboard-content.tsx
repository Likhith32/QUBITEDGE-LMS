'use client';

import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminDashboardContentProps {
  usersCount: number;
  submissionsCount: number;
  pendingCount: number;
}

export default function AdminDashboardContent({
  usersCount,
  submissionsCount,
  pendingCount,
}: AdminDashboardContentProps) {
  return (
    <div className="relative pb-10">
      {/* Premium Background Effects */}
      <div className="bg-mesh opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
            Admin Command Center
          </h1>
          <p className="text-lg font-bold text-[#7182C7]">
            Full visibility and control over the internship ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard
            title="Total Interns"
            value={usersCount}
            icon={Users}
            accentColor="#7182C7"
          />
          <StatCard
            title="Pending Reviews"
            value={pendingCount}
            icon={AlertCircle}
            accentColor="#4A5DB5"
          />
          <StatCard
            title="Total Submissions"
            value={submissionsCount}
            icon={FileText}
            accentColor="#2238A4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-black text-[#1A1A2E]">Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Link href="/admin/users" className="group block p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-[#4A5DB5]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E9EEF9] flex items-center justify-center text-[#4A5DB5] group-hover:bg-[#4A5DB5] group-hover:text-white transition-colors">
                      <Users size={24} />
                    </div>
                    <div>
                      <span className="block font-black text-[#1A1A2E]">Manage Interns</span>
                      <span className="text-xs text-[#7182C7]">View profiles and activity</span>
                    </div>
                  </div>
                  <div className="text-[#A0ACDC] group-hover:text-[#4A5DB5] transition-colors">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </Link>

              <Link href="/admin/submissions" className="group block p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-[#4A5DB5]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E9EEF9] flex items-center justify-center text-[#4A5DB5] group-hover:bg-[#4A5DB5] group-hover:text-white transition-colors">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <span className="block font-black text-[#1A1A2E]">Review Queue</span>
                      <span className="text-xs text-[#7182C7]">{pendingCount} submissions waiting</span>
                    </div>
                  </div>
                  <div className="text-[#A0ACDC] group-hover:text-[#4A5DB5] transition-colors">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </Link>

              <Link href="/admin/curriculum" className="group block p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-[#4A5DB5]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E9EEF9] flex items-center justify-center text-[#4A5DB5] group-hover:bg-[#4A5DB5] group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <span className="block font-black text-[#1A1A2E]">Curriculum Hub</span>
                      <span className="text-xs text-[#7182C7]">Edit modules and quizzes</span>
                    </div>
                  </div>
                  <div className="text-[#A0ACDC] group-hover:text-[#4A5DB5] transition-colors">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
