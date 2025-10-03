'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { HealthifySnap } from '@/components/healthify-snap';
import { MealContent } from '@/components/meal-content';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

type MealTime =
  | 'breakfast'
  | 'morningSnack'
  | 'lunch'
  | 'eveningSnack'
  | 'dinner';

type MealData = {
  [key in MealTime]: FoodItem[];
};

export default function LogMealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

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
  
  const activeTabLabel = mealTimes.find(tab => tab.value === activeTab)?.label || 'Select Meal';

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
  }) => {
    setLoggedMeals((prevMeals) => ({
      ...prevMeals,
      [meal.mealTime]: [...prevMeals[meal.mealTime], ...meal.items],
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

        <Tabs value={activeTab} className="w-full">
          <div className="flex items-center">
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between">
                    {activeTabLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {mealTimes.map((meal) => (
                    <DropdownMenuItem
                      key={meal.value}
                      asChild
                      onSelect={() => router.push(`/log-meal/${meal.value}`)}
                    >
                       <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="grid w-full grid-cols-6">
                  {mealTimes.map((meal) => (
                    <TabsTrigger key={meal.value} value={meal.value} asChild>
                      <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
            <Button variant="ghost" className="ml-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </div>
          <TabsContent value={activeTab}>
            {activeTab === 'healthify-snap' ? (
              <HealthifySnap onLogMeal={handleLogMeal} />
            ) : (
              <MealContent
                mealTime={activeTab as MealTime}
                items={loggedMeals[activeTab as MealTime] || []}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
