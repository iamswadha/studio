'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppShell } from './app-shell';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/signup') {
      router.push('/signup');
    }
    if(!isUserLoading && user && pathname === '/signup') {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, pathname, router]);

  const isAuthPage = pathname === '/signup';

  if (isUserLoading && !isAuthPage) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </AppShell>
    );
  }

  if (!user && !isAuthPage) {
     return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </AppShell>
    );
  }
  
  if (user && isAuthPage) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return <>{children}</>;
}
