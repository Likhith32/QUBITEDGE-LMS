'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accentColor: string;
  isProgress?: boolean;
  progressValue?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor,
  isProgress,
  progressValue = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="qe-card qe-card-hover border-none cursor-default h-full">
        <CardContent className="p-8">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7182C7] transition-colors group-hover:text-[#2238A4]">
                {title}
              </p>
              
              <p className="text-5xl font-black tracking-tight text-[#1A1A2E]" 
                 style={{ fontFamily: 'Playfair Display' }}>
                {value}
              </p>
              
              {subtitle && (
                <p className="text-xs font-bold text-[#A0ACDC]">
                  {subtitle}
                </p>
              )}
            </div>
            
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:shadow-2xl" 
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`, 
                color: accentColor,
                border: `1px solid ${accentColor}30`,
                boxShadow: `0 10px 25px ${accentColor}15`
              }}
            >
              <Icon size={32} className="drop-shadow-lg" />
            </motion.div>
          </div>

          {isProgress && (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#A0ACDC]">
                 <span>Progress</span>
                 <span>{progressValue}%</span>
              </div>
              <div className="h-3 w-full bg-[#E9EEF9] rounded-full overflow-hidden border border-blue-50/50 shadow-inner p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r from-[#7182C7] via-[#4A5DB5] to-[#2238A4] 
                    ${progressValue === 100 ? 'shadow-[0_0_20px_rgba(34,56,164,0.5)]' : 'shadow-lg'}`}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
