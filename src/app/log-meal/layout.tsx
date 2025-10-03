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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
    };
    setNextMealId(prev => prev + 1);

    setLoggedMeals((prevMeals) => ({
      ...prevMeals,
      [meal.mealTime]: [...prevMeals[meal.mealTime], newMeal],
    }));
    router.push(`/log-meal/${meal.mealTime}`);
  };

  const handleTabChange = (value: string) => {
    router.push(`/log-meal/${value}`);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Today's Insights"
          description="Log your meals to get AI-powered insights and recommendations."
        />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center">
            {isMobile ? (
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  {mealTimes.map((meal) => (
                    <SelectItem key={meal.value} value={meal.value}>
                      {meal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex">
                  {mealTimes.map((meal) => (
                    <TabsTrigger key={meal.value} value={meal.value} asChild>
                      <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
            <Button variant="ghost">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </div>
          <TabsContent value={activeTab} className="mt-4">
            {activeTab === 'healthify-snap' ? (
              <HealthifySnap onLogMeal={handleLogMeal} />
            ) : (
              <MealContent
                mealTime={activeTab as MealTime}
                loggedMeals={loggedMeals[activeTab as MealTime] || []}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
