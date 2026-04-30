'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Loader2, Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SubmissionReviewDialog({ submission }: { submission: any }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  
  const router = useRouter();

  const handleReview = async (status: 'approved' | 'rejected') => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/submissions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, status, feedback }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to review submission');
      }

      toast.success(`Submission marked as ${status}`);
      setOpen(false);
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-[#40C4D0] hover:text-[#32B0BC] hover:bg-[#40C4D0]/10">
          <Eye size={16} className="mr-1" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl border-none p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Playfair Display', color: '#2C2C2C' }}>
            Review Submission
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm text-[#2C2C2C]">{submission.profiles?.full_name}</p>
              <p className="text-xs text-[#7A7268]">{submission.tasks?.title}</p>
            </div>
            <span className="text-xs font-bold uppercase text-[#7A7268] bg-[#E8E4DE] px-2 py-1 rounded">
              {submission.format}
            </span>
          </div>

          <div className="p-4 rounded-xl border bg-[#FAFAFA]" style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
            <Label className="text-xs font-bold text-[#7A7268] uppercase tracking-wider mb-2 block">Content</Label>
            {submission.format === 'github' ? (
              <a href={submission.content} target="_blank" rel="noreferrer" className="flex items-center text-sm text-[#40C4D0] hover:underline break-all font-medium">
                {submission.content} <ExternalLink size={14} className="ml-1" />
              </a>
            ) : submission.format === 'text' ? (
              <div className="text-sm text-[#2C2C2C] whitespace-pre-wrap">
                {submission.content}
              </div>
            ) : (
              <a href={submission.file_path || '#'} target="_blank" rel="noreferrer" className="flex items-center text-sm text-[#40C4D0] hover:underline break-all font-medium">
                Download {submission.format.toUpperCase()} Attachment <ExternalLink size={14} className="ml-1" />
              </a>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <Textarea 
              id="feedback" 
              placeholder="Provide constructive feedback..."
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              className="rounded-xl min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={() => handleReview('rejected')} 
              disabled={isLoading || submission.status === 'rejected'}
              variant="outline"
              className="flex-1 h-11 rounded-xl text-[#D95F5F] hover:text-[#D95F5F] hover:bg-[#D95F5F]/10 border-[#D95F5F]/30"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><X size={16} className="mr-2" /> Reject / Re-request</>}
            </Button>
            <Button 
              onClick={() => handleReview('approved')} 
              disabled={isLoading || submission.status === 'approved'}
              className="flex-1 h-11 rounded-xl text-white hover:opacity-90"
              style={{ background: '#4CAF7D' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><Check size={16} className="mr-2" /> Approve</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
