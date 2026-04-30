'use client';

import { LeaderboardEntry } from '@/types';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {entries.map((entry, index) => {
        const isCurrentUser = entry.user_id === currentUserId;

        return (
          <motion.div
            key={entry.user_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border shadow-sm transition-all hover:shadow-md"
            style={{ 
              borderColor: isCurrentUser ? '#40C4D0' : 'rgba(201,168,130,0.2)',
              borderLeftWidth: isCurrentUser ? '4px' : '1px',
              backgroundColor: isCurrentUser ? '#40C4D005' : '#FFFFFF'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 text-center text-sm font-bold font-mono" style={{ color: '#7A7268' }}>
                #{entry.rank}
              </span>
              
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: '#40C4D0' }}
              >
                {entry.full_name.charAt(0)}
              </div>
              
              <div>
                <h3 className="font-bold text-sm" style={{ color: '#2C2C2C' }}>
                  {entry.full_name} {isCurrentUser && <span className="text-[10px] bg-[#40C4D0] text-white px-1.5 py-0.5 rounded ml-1">YOU</span>}
                </h3>
                <p className="text-xs" style={{ color: '#7A7268' }}>{entry.domain || 'Intern'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8768A]/10 text-[#B8768A]">
                <Flame size={14} />
                <span className="text-xs font-bold">{entry.current_streak}</span>
              </div>
              
              <div className="text-right w-16">
                <span className="text-lg font-bold font-mono" style={{ color: '#2C2C2C' }}>
                  {entry.score}
                </span>
                <span className="text-[10px] font-medium block uppercase tracking-wider" style={{ color: '#7A7268' }}>Pts</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
