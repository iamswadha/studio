import { getPersonalizedRecommendations } from '@/ai/flows/get-personalized-recommendations';
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
  Flame,
  Droplets,
  HeartPulse,
  BrainCircuit,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';

async function RiaCorner() {
  // In a real app, this data would be fetched from the user's profile and logs.
  const recommendationInput = {
    activityLogs: 'Walked 8,000 steps, 30-min HIIT workout.',
    foodLogs: 'Breakfast: Oatmeal with berries (350 kcal). Lunch: Grilled chicken salad (500 kcal). Dinner: Salmon with quinoa (600 kcal).',
    healthData: 'Name: Alex, Age: 30, Gender: Male, Height: 180cm, Weight: 75kg.',
    fitnessGoals: 'Lose 2kg of fat and build lean muscle.',
  };

  const recommendations = await getPersonalizedRecommendations(
    recommendationInput
  );

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="text-primary" />
          Ria's Corner
        </CardTitle>
        <CardDescription>
          Your daily personalized AI-powered insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-1">
            <Lightbulb className="text-accent" />
            Today's Suggestions
          </h3>
          <p className="text-sm text-muted-foreground">
            {recommendations.suggestions}
          </p>
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-1">
            <HeartPulse className="text-accent" />
            Daily Insights
          </h3>
          <p className="text-sm text-muted-foreground">
            {recommendations.insights}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Welcome Back, User!"
          description="Here's a snapshot of your health and fitness journey today."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        <RiaCorner />
      </div>
    </AppShell>
  );
}
