import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Flame, Droplets, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Welcome Back!"
          description="Here's a snapshot of your health and fitness journey today."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calories Consumed
              </CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,450 / 2,200 kcal</div>
              <p className="text-xs text-muted-foreground">
                +200 from yesterday
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/log-meal"
                className="text-sm font-medium text-primary hover:underline"
              >
                Log another meal
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6 / 8 glasses</div>
              <p className="text-xs text-muted-foreground">
                You're almost there!
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Log water
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Energy
              </CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340 kcal</div>
              <p className="text-xs text-muted-foreground">
                from your 30-min HIIT workout
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/activity"
                className="text-sm font-medium text-primary hover:underline"
              >
                View activity
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
