import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center md:justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 gap-2">{children}</div>}
    </div>
  );
}
