'use client';

import { AlertCircle, Bell, Clock } from 'lucide-react';
import { Announcement } from '@/types';
import { motion } from 'framer-motion';

interface AnnouncementStripProps {
  announcements: Announcement[];
}

export default function AnnouncementStrip({ announcements }: AnnouncementStripProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 mb-12"
    >
      {announcements.map((announcement, idx) => {
        let icon, styleClass, iconColor;
        
        switch (announcement.type) {
          case 'important':
            icon = <AlertCircle size={18} />;
            iconColor = '#E11D48';
            styleClass = 'bg-rose-50/80 border-rose-100 text-rose-900 border-l-4 border-l-rose-500';
            break;
          case 'deadline':
            icon = <Clock size={18} />;
            iconColor = '#D97706';
            styleClass = 'bg-amber-50/80 border-amber-100 text-amber-900 border-l-4 border-l-amber-500';
            break;
          case 'general':
          default:
            icon = <Bell size={18} />;
            iconColor = '#4A5DB5';
            styleClass = 'bg-white/80 border-blue-100 text-[#1A1A2E] border-l-4 border-l-[#4A5DB5]';
            break;
        }

        return (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start gap-4 p-5 rounded-2xl shadow-xl backdrop-blur-md border transition-all hover:translate-x-1 ${styleClass}`}
          >
            <div className="mt-0.5" style={{ color: iconColor }}>{icon}</div>
            <div className="flex-1">
              <p className="text-sm font-black leading-relaxed opacity-80">
                {announcement.message}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
