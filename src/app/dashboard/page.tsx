
import { getPersonalizedRecommendations } from '@/ai/flows/get-personalized-recommendations';
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
  BrainCircuit,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';
import Link from 'next/link';

async function RiaCorner() {
  // In a real app, this data would be fetched from the user's profile and logs.
  // const recommendationInput = {
  //   activityLogs: 'Walked 8,000 steps, 30-min HIIT workout.',
  //   foodLogs: 'Breakfast: Oatmeal with berries (350 kcal). Lunch: Grilled chicken salad (500 kcal). Dinner: Salmon with quinoa (600 kcal).',
  //   healthData: 'Name: Alex, Age: 30, Gender: Male, Height: 180cm, Weight: 75kg.',
  //   fitnessGoals: 'Lose 2kg of fat and build lean muscle.',
  // };

  // const recommendations = await getPersonalizedRecommendations(
  //   recommendationInput
  // );

  // Using mock data to avoid hitting API rate limits during development
  const recommendations = {
    suggestions: "Great job on the HIIT workout! To help with muscle recovery and growth, consider adding a protein shake or a Greek yogurt snack post-workout. Also, try to incorporate some more complex carbs in your lunch tomorrow to sustain your energy levels.",
    insights: "You're consistently hitting your protein goals, which is excellent for muscle building. Your calorie intake is well-aligned with your weight loss target. Keep up the great work with your activity levels!",
  }


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
          title="Welcome Back!"
          description="Here's a snapshot of your health and fitness journey today."
        />
        <RiaCorner />
      </div>
    </AppShell>
  );
}
