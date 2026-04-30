import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

export default function ScoreCard({ score, maxScore }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const isPass = percentage >= 70;
  
  const accentColor = isPass ? '#40C4D0' : '#B8768A';
  const message = isPass ? 'Great Job!' : 'Keep Practicing!';

  return (
    <Card className="qe-card border-none shadow-xl max-w-md mx-auto overflow-hidden">
      <div className="h-3 w-full" style={{ background: accentColor }} />
      <CardContent className="pt-10 pb-8 text-center px-8">
        <div 
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: `${accentColor}15`, color: accentColor }}
        >
          <Trophy size={40} />
        </div>
        
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display', color: '#2C2C2C' }}>
          {message}
        </h2>
        <p className="text-sm mb-8" style={{ color: '#7A7268' }}>
          You have completed today's quiz.
        </p>

        <div className="py-6 rounded-2xl mb-8" style={{ border: `1.5px dashed ${accentColor}50`, background: '#FAFAFA' }}>
          <p className="text-sm font-medium mb-1" style={{ color: '#7A7268' }}>Your Score</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl font-bold font-mono" style={{ color: accentColor }}>{score}</span>
            <span className="text-2xl font-medium" style={{ color: '#7A7268' }}>/{maxScore}</span>
          </div>
        </div>

        <Link href="/progress">
          <Button className="w-full h-12 rounded-xl bg-white border-[1.5px]" style={{ borderColor: '#C9A882', color: '#2C2C2C' }}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Curriculum
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
