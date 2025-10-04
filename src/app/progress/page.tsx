'use client';

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Droplets, HeartPulse, Trophy } from 'lucide-react';
import Link from 'next/link';

const chartDataWeekly = [
  { day: 'Mon', calories: 2200, water: 8 },
  { day: 'Tue', calories: 1900, water: 7 },
  { day: 'Wed', calories: 2400, water: 9 },
  { day: 'Thu', calories: 2100, water: 8 },
  { day: 'Fri', calories: 2500, water: 6 },
  { day: 'Sat', calories: 2800, water: 7 },
  { day: 'Sun', calories: 2300, water: 8 },
];

const weightData = [
    { date: 'Wk 1', weight: 75.0 },
    { date: 'Wk 2', weight: 74.5 },
    { date: 'Wk 3', weight: 74.8 },
    { date: 'Wk 4', weight: 74.2 },
    { date: 'Wk 5', weight: 73.9 },
    { date: 'Wk 6', weight: 73.5 },
]

const chartConfig: ChartConfig = {
  calories: {
    label: 'Calories (kcal)',
    color: 'hsl(var(--primary))',
  },
  water: {
    label: 'Water (glasses)',
    color: 'hsl(var(--accent))',
  },
  weight: {
    label: 'Weight (kg)',
    color: 'hsl(var(--primary))',
  },
};

export default function ProgressPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading } = useDoc(userDocRef);

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Your Progress"
          description="Visualize your journey and celebrate your milestones. Consistency is key!"
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="text-primary" />
                Your Health Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-3/4" />
            ) : userProfile ? (
              <p className="text-lg text-muted-foreground">
                "{userProfile.fitnessGoals}"
              </p>
            ) : (
              <p>No fitness goals set yet. Go to your profile to add one!</p>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <div className="grid gap-8 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Intake</CardTitle>
                  <CardDescription>
                    Your calorie consumption over the last 7 days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartDataWeekly} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="calories" fill="var(--color-calories)" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Water Intake</CardTitle>
                  <CardDescription>
                    Your water consumption over the last 7 days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartDataWeekly} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="water" fill="var(--color-water)" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div className="grid gap-8 mt-4">
            <Card>
                <CardHeader>
                  <CardTitle>Weight Trend</CardTitle>
                  <CardDescription>
                    Your weight progress over the last few weeks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={weightData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent />}
                      />
                      <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} dot={{r: 4, fill: "var(--color-weight)"}} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
