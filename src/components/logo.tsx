import { Utensils } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" data-testid="logo">
      <div className="rounded-lg bg-primary/20 p-2">
        <Utensils className="h-6 w-6 text-primary" />
      </div>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        OyeBhukkaD
      </span>
    </div>
  );
}
