'use client';

import { useState } from 'react';
import { Trash2, Edit3, Loader2 } from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Note: Re-using the Dialog pattern since AlertDialog was removed in previous steps to avoid Radix conflicts
import { 
  Dialog as BaseDialog, 
  DialogContent as BaseDialogContent, 
  DialogDescription as BaseDialogDescription, 
  DialogFooter as BaseDialogFooter, 
  DialogHeader as BaseDialogHeader, 
  DialogTitle as BaseDialogTitle 
} from '@/components/ui/dialog';

interface QuizActionsProps {
  quiz: {
    id: string;
    day_id: string;
    days: {
      day_number: number;
      topic: string;
    };
  };
}

export default function QuizActions({ quiz }: QuizActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quiz.id);

      if (error) throw error;

      toast.success('Quiz deleted successfully.');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => toast.info('Edit functionality coming soon!')}
        className="p-3 rounded-xl bg-white border border-slate-100 text-[#7182C7] hover:text-[#4A5DB5] hover:border-[#4A5DB5]/30 transition-all shadow-sm"
      >
        <Edit3 size={18} />
      </button>
      <button 
        onClick={() => setShowDeleteAlert(true)}
        className="p-3 rounded-xl bg-white border border-slate-100 text-[#7182C7] hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
      >
        <Trash2 size={18} />
      </button>

      <BaseDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <BaseDialogContent className="rounded-[2.5rem] p-10 border-none bg-white shadow-2xl">
          <BaseDialogHeader>
            <BaseDialogTitle className="text-2xl font-black text-[#1A1A2E]">Confirm Deletion</BaseDialogTitle>
            <BaseDialogDescription className="text-md font-bold text-[#7182C7] mt-2">
              Are you sure you want to delete the quiz for <span className="text-[#1A1A2E]">Day {quiz.days?.day_number} — {quiz.days?.topic}</span>? This action cannot be undone.
            </BaseDialogDescription>
          </BaseDialogHeader>
          <BaseDialogFooter className="mt-8 gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowDeleteAlert(false)}
              className="h-14 px-8 rounded-2xl border-slate-200 font-black text-[#7182C7]"
            >
              Cancel
            </Button>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="h-14 px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-xl shadow-rose-500/20"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : 'Delete Permanently'}
            </Button>
          </BaseDialogFooter>
        </BaseDialogContent>
      </BaseDialog>
    </div>
  );
}
