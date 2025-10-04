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
  Bookmark,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Home' },
  { href: '/log-meal', icon: Utensils, label: 'Log Meal' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
  { href: '/food-menu', icon: Heart, label: 'Food Menu' },
  { href: '/activity', icon: Bookmark, label: 'Saved' },
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
            ? 'text-primary'
            : 'text-muted-foreground hover:text-primary'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium md:hidden">{label}</span>
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
    <div className="flex h-dvh flex-col md:flex-row bg-background">
      {/* Sidebar for Desktop - Hidden in this design */}
      <aside className="hidden md:flex md:w-24 md:flex-col md:border-r md:bg-background">
        <div className="flex h-full flex-col items-center py-4">
          <div className="p-4 border-b">
            <Logo />
          </div>
          <nav className="flex-1 space-y-4 p-4 mt-8">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
          <div className="mt-auto space-y-4 p-4">
             <Button variant="ghost" className="w-full justify-center text-muted-foreground">
                <Settings className="h-6 w-6" />
            </Button>
            <Button variant="ghost" className="w-full justify-center text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        {/* Bottom Navigation for Mobile */}
        <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm">
          <nav className="flex items-center justify-around p-2">
            {navItems.map((item) => (
               <NavItem
               key={item.href}
               href={item.href}
               icon={item.icon}
               label={item.label}
             />
            ))}
            <button className="flex-1">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground">
                <Menu className="h-6 w-6" />
                <span className="text-xs font-medium">More</span>
              </div>
            </button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
