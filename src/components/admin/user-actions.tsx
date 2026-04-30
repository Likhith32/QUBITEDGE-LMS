'use client';

import { useState } from 'react';
import { Trash2, Edit3, MoreVertical, Loader2 } from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export default function UserActions({ user }: UserActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      // Note: In a real app, deleting a user usually requires an admin API 
      // because profiles are linked to auth.users.
      const res = await fetch(`/api/admin/delete-user?id=${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete user');
      }

      toast.success('Intern account removed successfully.');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger 
          render={
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
              <MoreVertical size={18} className="text-[#7182C7]" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-none bg-white">
          <DropdownMenuItem 
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 text-[#1A1A2E] font-bold transition-colors"
            onClick={() => toast.info('Edit functionality coming soon!')}
          >
            <Edit3 size={16} className="text-[#4A5DB5]" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 bg-slate-50" />
          <DropdownMenuItem 
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-rose-50 text-rose-500 font-bold transition-colors"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash2 size={16} />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent className="rounded-[2.5rem] p-10 border-none bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#1A1A2E]">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-md font-bold text-[#7182C7] mt-2">
              Are you sure you want to remove <span className="text-[#1A1A2E]">{user.full_name}</span>? This will permanently delete their progress, scores, and profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-4">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
