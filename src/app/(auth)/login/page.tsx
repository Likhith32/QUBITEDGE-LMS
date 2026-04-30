'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QubitedgeLogo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Login successful');
      router.push('/dashboard');
      router.refresh();
      
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="qe-card border-none shadow-xl">
      <CardHeader className="space-y-4 pb-6 pt-8 text-center">
        <div className="flex justify-center mb-2">
          <QubitedgeLogo size={64} />
        </div>
        <CardTitle className="text-3xl" style={{ fontFamily: 'Playfair Display' }}>
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to the qubitedge LMS Portal to continue your internship journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#7A7268' }}>Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@qubitedge.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-[1.5px]"
              style={{ borderColor: 'rgba(201,168,130,0.4)', background: '#FAFAFA' }}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#7A7268' }}>Password</Label>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-[1.5px]"
              style={{ borderColor: 'rgba(201,168,130,0.4)', background: '#FAFAFA' }}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full btn-primary h-12 text-md mt-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm" style={{ color: '#7A7268' }}>
          <p>Don't have an account? Contact your administrator.</p>
        </div>
      </CardContent>
    </Card>
  );
}
