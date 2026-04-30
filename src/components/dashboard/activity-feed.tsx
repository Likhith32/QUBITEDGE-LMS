'use client';

import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FileText, Trophy, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  type: 'attendance' | 'quiz' | 'task' | 'achievement';
  title: string;
  description: string;
  date: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="qe-card mt-8 border-none bg-white/40 shadow-2xl rounded-[3rem]">
        <CardHeader className="pb-8 pt-10 px-10">
          <CardTitle className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Playfair Display', color: '#1A1A2E' }}>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          {activities.length === 0 ? (
            <div className="py-20 text-center" style={{ color: '#7182C7' }}>
              <p className="text-lg font-black opacity-50 uppercase tracking-widest">No activity yet</p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-10 relative"
            >
              {/* Timeline Line */}
              <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-gradient-to-b from-[#E9EEF9] via-[#A0ACDC]/30 to-[#E9EEF9]" />
              
              {activities.map((activity, idx) => {
                let icon, bgColor, color;
                
                switch (activity.type) {
                  case 'attendance':
                    icon = <LogIn size={20} />;
                    bgColor = 'bg-blue-50';
                    color = 'text-blue-500';
                    break;
                  case 'quiz':
                    icon = <CheckCircle2 size={20} />;
                    bgColor = 'bg-emerald-50';
                    color = 'text-emerald-500';
                    break;
                  case 'task':
                    icon = <FileText size={20} />;
                    bgColor = 'bg-[#E9EEF9]';
                    color = 'text-[#4A5DB5]';
                    break;
                  case 'achievement':
                    icon = <Trophy size={20} />;
                    bgColor = 'bg-amber-50';
                    color = 'text-amber-500';
                    break;
                }

                return (
                  <motion.div 
                    key={activity.id} 
                    variants={item}
                    className="relative flex items-start gap-8 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 border-4 border-white ${bgColor} ${color}`}>
                      {icon}
                    </div>
                    
                    <div className="flex-1 p-6 rounded-[2rem] border border-white/60 bg-white/50 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-white/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="font-black text-md text-[#1A1A2E] group-hover:text-[#2238A4] transition-colors tracking-tight">{activity.title}</h3>
                        <time className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0ACDC]">
                          {format(parseISO(activity.date), 'MMM d, h:mm a')}
                        </time>
                      </div>
                      <div className="text-sm font-bold leading-relaxed text-[#7182C7]">{activity.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
