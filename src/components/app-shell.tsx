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
  isDesktop,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isDesktop?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href} className={cn(!isDesktop && 'flex-1')}>
      <div
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200',
          isDesktop && 'flex-row gap-2',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-primary'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className={cn('text-xs font-medium', isDesktop && 'text-sm')}>
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
      {/* Top Navigation for Desktop */}
      <header className="sticky top-0 z-10 hidden md:flex items-center justify-between border-b bg-background/95 px-8 py-2 backdrop-blur-sm">
        <Logo />
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isDesktop
            />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        {/* Bottom Navigation for Mobile/Tablet */}
        <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm md:hidden">
          <nav className="flex items-center justify-around p-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
}
