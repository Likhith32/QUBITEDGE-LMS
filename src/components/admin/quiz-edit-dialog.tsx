'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Trash2, Save, HelpCircle, ChevronRight, ChevronLeft, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Question {
  question: string;
  options: string[];
  correct_index: number;
}

interface QuizEditDialogProps {
  quiz: {
    id: string;
    day_id: string;
    questions: Question[];
    max_score: number;
    days: {
      day_number: number;
      topic: string;
    };
  };
}

export default function QuizEditDialog({ quiz }: QuizEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1-10: Questions, 11: Summary
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    // Validation
    const invalidQuestion = questions.findIndex(q => !q.question || q.options.some(o => !o));
    if (invalidQuestion !== -1) {
      toast.error(`Question ${invalidQuestion + 1} is incomplete.`);
      setCurrentStep(invalidQuestion + 1);
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          questions,
          max_score: questions.length
        })
        .eq('id', quiz.id);

      if (error) throw error;

      toast.success('Quiz updated successfully!');
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <button className="p-3 rounded-xl bg-white border border-slate-100 text-[#7182C7] hover:text-[#4A5DB5] hover:border-[#4A5DB5]/30 transition-all shadow-sm">
            <Edit3 size={18} />
          </button>
        }
      />
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[3rem] border-none bg-white shadow-2xl">
        <div className="relative">
          {/* Header */}
          <div className="h-32 bg-gradient-to-br from-[#4A5DB5] to-[#1A1A2E] flex items-center px-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10">
              <DialogTitle className="text-3xl font-black text-white tracking-tight">Edit Day {quiz.days.day_number} Quiz</DialogTitle>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
                {currentStep > 10 ? 'Final Review' : `Question ${currentStep} of 10`}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 11) * 100}%` }}
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {currentStep <= 10 ? (
                <motion.div 
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Question Text</Label>
                    <Input 
                      placeholder="What is the output of..."
                      value={questions[currentStep - 1].question}
                      onChange={(e) => handleQuestionChange(currentStep - 1, 'question', e.target.value)}
                      className="h-14 rounded-2xl border-slate-200 font-bold px-6"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions[currentStep - 1].options.map((option, oIdx) => (
                      <div key={oIdx} className="space-y-2">
                        <Label className="text-[10px] font-black text-[#7182C7] uppercase tracking-widest px-2">Option {String.fromCharCode(65 + oIdx)}</Label>
                        <div className="relative group">
                          <Input 
                            value={option}
                            onChange={(e) => handleOptionChange(currentStep - 1, oIdx, e.target.value)}
                            className={`h-14 rounded-2xl border-slate-200 font-bold px-6 pr-12 ${questions[currentStep - 1].correct_index === oIdx ? 'border-[#4A5DB5] bg-blue-50 text-[#4A5DB5]' : ''}`}
                          />
                          <button 
                            onClick={() => handleQuestionChange(currentStep - 1, 'correct_index', oIdx)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all
                              ${questions[currentStep - 1].correct_index === oIdx ? 'bg-[#4A5DB5] text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'}`}
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step-final"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A2E]">Changes Validated</h3>
                    <p className="text-[#7182C7] font-bold mt-2">The quiz architecture has been successfully modified.</p>
                  </div>
                  <Button 
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="h-16 px-10 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20"
                  >
                    {isSubmitting ? 'Syncing...' : 'Save Changes'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-8 border-t border-slate-50 flex justify-between bg-slate-50/50">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="h-12 rounded-xl border-slate-200 font-black px-6"
              disabled={currentStep === 1}
            >
              <ChevronLeft size={18} className="mr-1" /> Previous
            </Button>
            
            {currentStep < 11 && (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="h-12 rounded-xl bg-[#4A5DB5] hover:bg-[#2238A4] text-white font-black px-6"
              >
                Next Question <ChevronRight size={18} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
