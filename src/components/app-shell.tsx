'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User as UserIcon,
  UtensilsCrossed,
  ShoppingBasket,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/food-menu', icon: Search, label: 'Search' },
  { href: '/log-meal', icon: UtensilsCrossed, label: 'Log Meal' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
  { href: '/activity', icon: UserIcon, label: 'Profile' },
];

function BottomNavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="flex-1">
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2 rounded-lg',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/signup');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Navigation Bar */}
      <footer className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <BottomNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
      </footer>
    </div>
  );
}
