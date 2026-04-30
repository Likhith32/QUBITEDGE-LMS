'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/types';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface QuizPlayerProps {
  quizId: string;
  questions: QuizQuestion[];
}

export default function QuizPlayer({ quizId, questions }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  
  const router = useRouter();
  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedOption;
    setAnswers(newAnswers);
    
    setShowResult(true);
  };

  const handleContinue = async () => {
    setShowResult(false);
    setSelectedOption(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct_index) {
        score++;
      }
    });

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, score, answers }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Submission failed');
      }

      toast.success('Quiz completed successfully!');
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: '#7A7268' }}>
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium" style={{ color: '#40C4D0' }}>
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="h-2 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300" 
          style={{ backgroundColor: '#40C4D0', width: `${progress}%` }} 
        />
      </div>

      <Card className="qe-card border-none shadow-lg">
        <CardContent className="p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ color: '#2C2C2C', lineHeight: '1.4' }}>
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let borderClass = 'border-[1.5px] border-[#C9A882]/30';
              let bgClass = 'bg-white hover:bg-[#FAFAFA]';
              
              if (isSelected && !showResult) {
                borderClass = 'border-[2px] border-[#40C4D0]';
                bgClass = 'bg-[#40C4D0]/5';
              } else if (showResult) {
                if (idx === currentQ.correct_index) {
                  borderClass = 'border-[2px] border-[#4CAF7D]';
                  bgClass = 'bg-[#4CAF7D]/10';
                } else if (isSelected && idx !== currentQ.correct_index) {
                  borderClass = 'border-[2px] border-[#D95F5F]';
                  bgClass = 'bg-[#D95F5F]/10';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl transition-all ${borderClass} ${bgClass} flex justify-between items-center`}
                >
                  <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>{opt}</span>
                  {showResult && idx === currentQ.correct_index && (
                    <CheckCircle2 size={20} className="text-[#4CAF7D]" />
                  )}
                  {showResult && isSelected && idx !== currentQ.correct_index && (
                    <XCircle size={20} className="text-[#D95F5F]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            {!showResult ? (
              <Button 
                onClick={handleNext} 
                disabled={selectedOption === null}
                className="btn-primary h-11 px-8 rounded-xl"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={handleContinue} 
                disabled={isSubmitting}
                className="h-11 px-8 rounded-xl text-white"
                style={{ background: '#2C2C2C' }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Continue <ArrowRight size={16} className="ml-2" /></>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
