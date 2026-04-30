import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';

export default async function AdminAnnouncementsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display', color: '#2C2C2C' }}>
          Announcements
        </h1>
        <p className="text-sm" style={{ color: '#7A7268' }}>
          Broadcast messages to all interns.
        </p>
      </div>

      <Card className="qe-card border-none">
        <CardContent className="p-6 text-center text-[#7A7268]">
          <p>Announcement composer and history will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
