'use client';

import { Menu, User as UserIcon } from 'lucide-react';
import QubitedgeLogo from '@/components/logo';

interface TopbarProps {
  user: { full_name: string; avatar_url: string | null; role: string } | null;
}

export default function Topbar({ user }: TopbarProps) {
  const isAdmin = user?.role === 'admin';
  const accentColor = isAdmin ? '#B8768A' : '#40C4D0';

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b fixed top-0 left-0 right-0 z-40"
      style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
      <div className="flex items-center gap-2">
        <QubitedgeLogo size={28} />
        <h1 className="text-base font-bold" style={{ fontFamily: 'DM Sans', color: accentColor }}>
          qubitedge
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: accentColor }}>
          {user?.full_name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
