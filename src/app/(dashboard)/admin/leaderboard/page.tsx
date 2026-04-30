import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default async function AdminLeaderboardPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display', color: '#2C2C2C' }}>
          Leaderboard Overview
        </h1>
        <p className="text-sm" style={{ color: '#7A7268' }}>
          View global intern rankings.
        </p>
      </div>

      <Card className="qe-card border-none">
        <CardContent className="p-6 text-center">
          <p className="text-[#7A7268] mb-4">You can view the full leaderboard from the intern's perspective.</p>
          <Link href="/leaderboard" className="text-[#B8768A] hover:underline font-medium">
            Go to Global Leaderboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
