'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  BookOpen,
  LineChart,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';

const navItems = [
  { href: '/food-menu', icon: LayoutGrid, label: 'Home' },
  { href: '/log-meal', icon: BookOpen, label: 'Diary' },
  { href: '/progress', icon: LineChart, label: 'Progress' },
  { href: '/profile', icon: User, label: 'Profile' },
];

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href} className="flex-1">
      <div
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-primary'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">
          {label}
        </span>
      </div>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/signup');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm">
          <nav className="flex items-center justify-around p-2 max-w-2xl mx-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
             <Button variant="ghost" size="icon" onClick={handleLogout} className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-primary h-auto w-auto">
                <LogOut className="h-6 w-6" />
                <span className="text-xs font-medium">Logout</span>
             </Button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
