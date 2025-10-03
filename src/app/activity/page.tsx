import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Flame, Footprints, HeartPulse, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ActivityPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Activity Tracking"
          description="Sync your wearable devices to automatically track your fitness data."
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <Image
                src="/apple-health.svg"
                alt="Apple Health"
                width={20}
                height={20}
                className="mr-2"
              />
              Connect Apple Health
            </Button>
            <Button variant="outline">
              <Image
                src="/google-fit.svg"
                alt="Google Fit"
                width={20}
                height={20}
                className="mr-2"
              />
              Connect Google Fit
            </Button>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,123</div>
              <p className="text-xs text-muted-foreground">
                Target: 10,000 steps
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Energy
              </CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">452 kcal</div>
              <p className="text-xs text-muted-foreground">
                Target: 500 kcal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Exercise Minutes
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 min</div>
              <p className="text-xs text-muted-foreground">
                Target: 60 min
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resting Heart Rate
              </CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62 bpm</div>
              <p className="text-xs text-muted-foreground">
                Average for today
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>
              Your latest synced workout sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="font-medium">High-Intensity Interval Training</div>
                <div className="text-right text-sm">
                  <p>30 min</p>
                  <p className="text-muted-foreground">280 kcal</p>
                </div>
              </li>
              <Separator />
              <li className="flex items-center justify-between">
                <div className="font-medium">Outdoor Walk</div>
                <div className="text-right text-sm">
                  <p>45 min</p>
                  <p className="text-muted-foreground">172 kcal</p>
                </div>
              </li>
              <Separator />
              <li className="flex items-center justify-between">
                <div className="font-medium">Strength Training</div>
                <div className="text-right text-sm">
                  <p>60 min</p>
                  <p className="text-muted-foreground">350 kcal</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
