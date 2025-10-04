'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  ShoppingBasket,
  Bookmark,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Home' },
  { href: '/shop', icon: ShoppingBasket, label: 'Shop' },
  { href: '/saved', icon: Bookmark, label: 'Saved' },
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
       <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between">
           <Logo />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
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
          </nav>
        </footer>
      </div>
    </div>
  );
}
