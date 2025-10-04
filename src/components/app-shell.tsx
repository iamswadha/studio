'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  BarChart3,
  Home,
  Utensils,
  User,
  Heart,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/log-meal', icon: Utensils, label: 'Log Meal' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
  { href: '/activity', icon: LayoutGrid, label: 'Activity' },
  { href: '/food-menu', icon: Heart, label: 'Menu' },
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
    <Link href={href} className="flex-1 md:flex-none">
      <div
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 md:flex-row md:gap-3 md:w-full md:justify-start',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium md:text-sm">{label}</span>
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
    <div className="flex h-dvh flex-col md:flex-row bg-muted/40">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <Logo />
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
          <div className="mt-auto space-y-2 p-4">
             <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <Settings className="h-5 w-5" />
                Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        {/* Bottom Navigation for Mobile */}
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
             <button onClick={handleLogout} className="flex-1">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground">
                <LogOut className="h-5 w-5" />
                <span className="text-xs font-medium">Logout</span>
              </div>
            </button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
