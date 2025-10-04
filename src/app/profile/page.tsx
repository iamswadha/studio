'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { Flame, Footprints, Zap } from 'lucide-react';

const weightData = [
    { date: 'Wk 1', weight: 75.0 },
    { date: 'Wk 2', weight: 74.5 },
    { date: 'Wk 3', weight: 74.8 },
    { date: 'Wk 4', weight: 74.2 },
    { date: 'Wk 5', weight: 73.9 },
    { date: 'Wk 6', weight: 73.5 },
];

const activityData = [
    { day: 'Mon', steps: 8123, calories: 452, minutes: 45 },
    { day: 'Tue', steps: 7543, calories: 410, minutes: 40 },
    { day: 'Wed', steps: 9210, calories: 512, minutes: 60 },
    { day: 'Thu', steps: 8890, calories: 480, minutes: 55 },
    { day: 'Fri', steps: 10134, calories: 550, minutes: 65 },
    { day: 'Sat', steps: 12450, calories: 680, minutes: 90 },
    { day: 'Sun', steps: 8345, calories: 460, minutes: 50 },
];


const chartConfig: ChartConfig = {
  weight: {
    label: 'Weight (kg)',
    color: 'hsl(var(--primary))',
  },
  steps: {
    label: 'Steps',
    color: 'hsl(var(--chart-1))',
  },
  calories: {
    label: 'Calories Burned',
    color: 'hsl(var(--chart-2))',
  },
  minutes: {
    label: 'Exercise Minutes',
    color: 'hsl(var(--chart-3))',
  },
};


export default function ProfilePage() {
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
          title="Profile"
          description="Manage your account settings and preferences."
        >
          <Button>Edit Profile</Button>
        </PageHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className='lg:col-span-1 space-y-8'>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : userProfile ? (
                      <>
                        <div>
                            <p className="font-semibold">{userProfile.name}</p>
                            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Age:</strong> {userProfile.age}</p>
                            <p><strong>Gender:</strong> {userProfile.gender}</p>
                            <p><strong>Height:</strong> {userProfile.height} cm</p>
                            <p><strong>Weight:</strong> {userProfile.weight} kg</p>
                        </div>
                        <div>
                            <p className="font-semibold">Fitness Goals</p>
                            <p className="text-sm text-muted-foreground">{userProfile.fitnessGoals}</p>
                        </div>
                      </>
                    ) : (
                      <p>No profile information found.</p>
                    )}
                  </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                      <CardTitle>Weight Trend</CardTitle>
                      <CardDescription>
                        Your weight progress over the last few weeks.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity Summary</CardTitle>
                      <CardDescription>
                        Your activity metrics for the current week.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className='flex items-center gap-4'>
                            <Footprints className="h-8 w-8 text-primary" />
                            <div>
                                <p className='text-2xl font-bold'>{(activityData.reduce((acc, a) => acc + a.steps, 0) / 7).toFixed(0)}</p>
                                <p className='text-sm text-muted-foreground'>Avg Steps</p>
                            </div>
                        </div>
                         <div className='flex items-center gap-4'>
                            <Flame className="h-8 w-8 text-primary" />
                            <div>
                                <p className='text-2xl font-bold'>{(activityData.reduce((acc, a) => acc + a.calories, 0) / 7).toFixed(0)}</p>
                                <p className='text-sm text-muted-foreground'>Avg Kcal Burn</p>
                            </div>
                        </div>
                         <div className='flex items-center gap-4'>
                            <Zap className="h-8 w-8 text-primary" />
                            <div>
                                <p className='text-2xl font-bold'>{(activityData.reduce((acc, a) => acc + a.minutes, 0) / 7).toFixed(0)}</p>
                                <p className='text-sm text-muted-foreground'>Avg Minutes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </AppShell>
  );
}
