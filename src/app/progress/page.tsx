'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
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
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Your Progress"
          description="Visualize your journey and celebrate your milestones. Consistency is key!"
        />

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
