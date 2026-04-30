'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Code, FileText, Loader2, FileArchive } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SubmissionFormat } from '@/types';

interface SubmissionFormProps {
  taskId: string;
  acceptedFormats: string[];
}

export default function SubmissionForm({ taskId, acceptedFormats }: SubmissionFormProps) {
  const [activeTab, setActiveTab] = useState<SubmissionFormat>(
    (acceptedFormats[0] as SubmissionFormat) || 'github'
  );
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalContent = content;
      let filePath = null;

      // Handle file upload
      if ((activeTab === 'pdf' || activeTab === 'zip') && file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${taskId}_${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('submissions')
          .getPublicUrl(fileName);
          
        filePath = publicUrl;
        finalContent = file.name;
      } else if (!content) {
        throw new Error('Please provide submission content');
      }

      // Call API to save record and update streak
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          format: activeTab,
          content: finalContent,
          filePath,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Submission failed');
      }

      toast.success('Task submitted successfully!');
      router.refresh();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SubmissionFormat)}>
        <TabsList className="w-full grid grid-cols-4 bg-[#FAFAFA] border h-12 rounded-xl" style={{ borderColor: 'rgba(201,168,130,0.3)' }}>
          <TabsTrigger value="github" disabled={!acceptedFormats.includes('github')} className="data-[state=active]:bg-[#40C4D0] data-[state=active]:text-white rounded-lg transition-colors">
            <Code size={16} className="mr-2 hidden sm:inline" /> GitHub
          </TabsTrigger>
          <TabsTrigger value="pdf" disabled={!acceptedFormats.includes('pdf')} className="data-[state=active]:bg-[#40C4D0] data-[state=active]:text-white rounded-lg transition-colors">
            <FileText size={16} className="mr-2 hidden sm:inline" /> PDF
          </TabsTrigger>
          <TabsTrigger value="zip" disabled={!acceptedFormats.includes('zip')} className="data-[state=active]:bg-[#40C4D0] data-[state=active]:text-white rounded-lg transition-colors">
            <FileArchive size={16} className="mr-2 hidden sm:inline" /> ZIP
          </TabsTrigger>
          <TabsTrigger value="text" disabled={!acceptedFormats.includes('text')} className="data-[state=active]:bg-[#40C4D0] data-[state=active]:text-white rounded-lg transition-colors">
            <FileText size={16} className="mr-2 hidden sm:inline" /> Text
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="github" className="m-0">
            <div className="space-y-3">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input
                id="github-url"
                placeholder="https://github.com/username/repo"
                value={activeTab === 'github' ? content : ''}
                onChange={(e) => setContent(e.target.value)}
                className="rounded-xl border-[1.5px] h-12"
                style={{ borderColor: 'rgba(201,168,130,0.4)', background: '#FAFAFA' }}
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="m-0">
            <div className="space-y-3">
              <Label htmlFor="text-content">Submission Text</Label>
              <Textarea
                id="text-content"
                placeholder="Write your submission here..."
                value={activeTab === 'text' ? content : ''}
                onChange={(e) => setContent(e.target.value)}
                className="rounded-xl border-[1.5px] min-h-[150px]"
                style={{ borderColor: 'rgba(201,168,130,0.4)', background: '#FAFAFA' }}
              />
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="m-0">
            <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:bg-gray-50 relative"
              style={{ borderColor: '#40C4D0' }}>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={40} className="mx-auto text-[#40C4D0] mb-4" />
              <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                {file ? file.name : 'Click or drag PDF to upload'}
              </p>
              <p className="text-xs" style={{ color: '#7A7268' }}>Max file size 10MB</p>
            </div>
          </TabsContent>

          <TabsContent value="zip" className="m-0">
            <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:bg-gray-50 relative"
              style={{ borderColor: '#40C4D0' }}>
              <Input
                type="file"
                accept=".zip,.rar"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileArchive size={40} className="mx-auto text-[#40C4D0] mb-4" />
              <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                {file ? file.name : 'Click or drag ZIP archive to upload'}
              </p>
              <p className="text-xs" style={{ color: '#7A7268' }}>Max file size 50MB</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <Button 
        type="submit" 
        disabled={isSubmitting || (['pdf', 'zip'].includes(activeTab) && !file) || (['github', 'text'].includes(activeTab) && !content)}
        className="btn-primary w-full h-12 text-md"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          'Submit Task'
        )}
      </Button>
    </form>
  );
}
