'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { HealthifySnap } from '@/components/healthify-snap';
import { MealContent } from '@/components/meal-content';

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export type LoggedMeal = {
  id: number;
  items: FoodItem[];
  imageUrl?: string;
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  timestamp: string;
};

export type MealTime =
  | 'breakfast'
  | 'morningSnack'
  | 'lunch'
  | 'eveningSnack'
  | 'dinner';

export type MealData = {
  [key in MealTime]: LoggedMeal[];
};

export default function LogMealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [nextMealId, setNextMealId] = useState(0);

  const mealTimes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morningSnack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'eveningSnack', label: 'Evening Snack' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'healthify-snap', label: 'HealthifySnap' },
  ];

  const activeTab =
    mealTimes.find((tab) => pathname.includes(tab.value))?.value ||
    'morningSnack';

  const [loggedMeals, setLoggedMeals] = useState<MealData>({
    breakfast: [],
    morningSnack: [],
    lunch: [],
    eveningSnack: [],
    dinner: [],
  });

  const handleLogMeal = (meal: {
    mealTime: MealTime;
    items: FoodItem[];
    totalNutrition: any;
    imageUrl?: string;
  }) => {
    const newMeal: LoggedMeal = {
      id: nextMealId,
      items: meal.items,
      totalNutrition: meal.totalNutrition,
      imageUrl: meal.imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNextMealId(prev => prev + 1);

    setLoggedMeals((prevMeals) => ({
      ...prevMeals,
      [meal.mealTime]: [...prevMeals[meal.mealTime], newMeal].sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    }));
    router.push(`/log-meal/${meal.mealTime}`);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Today's Insights"
          description="Log your meals to get AI-powered insights and recommendations."
        />

        <Tabs value={activeTab} orientation="vertical" className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="col-span-1 flex flex-col items-stretch gap-2">
            <TabsList className="grid w-full grid-cols-1 h-auto">
              {mealTimes.map((meal) => (
                <TabsTrigger key={meal.value} value={meal.value} asChild>
                  <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="ghost" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </div>
          <div className="col-span-1 md:col-span-3">
            <TabsContent value={activeTab} className="mt-0">
              {activeTab === 'healthify-snap' ? (
                <HealthifySnap onLogMeal={handleLogMeal} />
              ) : (
                <MealContent
                  mealTime={activeTab as MealTime}
                  loggedMeals={loggedMeals[activeTab as MealTime] || []}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
}
