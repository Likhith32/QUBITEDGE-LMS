import { MessageSquare } from 'lucide-react';
import { SubmissionStatus } from '@/types';

interface FeedbackDisplayProps {
  feedback: string;
  status: SubmissionStatus;
}

export default function FeedbackDisplay({ feedback, status }: FeedbackDisplayProps) {
  const borderColor = status === 'rejected' ? '#D95F5F' : status === 'approved' ? '#4CAF7D' : '#40C4D0';
  const bgColor = status === 'rejected' ? '#D95F5F08' : status === 'approved' ? '#4CAF7D08' : '#40C4D008';

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm h-fit" style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} style={{ color: borderColor }} />
        <h3 className="font-bold" style={{ color: '#2C2C2C' }}>Admin Feedback</h3>
      </div>
      
      <div 
        className="p-4 rounded-xl border-l-4 text-sm"
        style={{ 
          borderLeftColor: borderColor, 
          backgroundColor: bgColor,
          color: '#2C2C2C',
          whiteSpace: 'pre-wrap'
        }}
      >
        {feedback}
      </div>
    </div>
  );
}
