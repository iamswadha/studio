'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { useCollection, useMemoFirebase } from '@/firebase/firestore/use-collection';
import {
  collection,
  serverTimestamp,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export type LoggedMeal = {
  id: string; // Firestore document ID
  items: FoodItem[];
  imageUrl?: string;
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  mealTime: MealTime;
  timestamp: any;
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
  const { user } = useUser();
  const firestore = useFirestore();

  const mealsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return query(
      collection(firestore, 'users', user.uid, 'meals'),
      where('timestamp', '>=', Timestamp.fromDate(today)),
      where('timestamp', '<', Timestamp.fromDate(tomorrow)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: mealsFromDb } = useCollection<LoggedMeal>(mealsQuery);

  const [loggedMeals, setLoggedMeals] = useState<MealData>({
    breakfast: [],
    morningSnack: [],
    lunch: [],
    eveningSnack: [],
    dinner: [],
  });

  useEffect(() => {
    if (mealsFromDb) {
      const newMealData: MealData = {
        breakfast: [],
        morningSnack: [],
        lunch: [],
        eveningSnack: [],
        dinner: [],
      };
      mealsFromDb.forEach((meal) => {
        if (newMealData[meal.mealTime]) {
          newMealData[meal.mealTime].push(meal);
        }
      });
      setLoggedMeals(newMealData);
    } else {
      // Clear meals if user logs out or there's no data
      setLoggedMeals({
        breakfast: [],
        morningSnack: [],
        lunch: [],
        eveningSnack: [],
        dinner: [],
      });
    }
  }, [mealsFromDb]);

  const mealTimes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morningSnack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'eveningSnack', label: 'Evening Snack' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'healthify-snap', label: 'HealthifySnap' },
  ];

  const activeTab = pathname.split('/').pop() || 'breakfast';

  const handleLogMeal = (meal: {
    mealTime: MealTime;
    items: FoodItem[];
    totalNutrition: any;
    imageUrl?: string;
  }) => {
    if (!user || !meal.mealTime) return;

    const mealToLog = {
      ...meal,
      userId: user.uid,
      timestamp: serverTimestamp(),
    };

    const mealsCol = collection(firestore, 'users', user.uid, 'meals');
    addDocumentNonBlocking(mealsCol, mealToLog);

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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            <Button variant="outline" asChild className="ml-2 shrink-0">
              <Link href="/log-meal/manual">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Food
              </Link>
            </Button>
          </div>

          {mealTimes.map((meal) => (
            <TabsContent key={meal.value} value={meal.value} className="mt-4">
              {meal.value === 'healthify-snap' ? (
                <HealthifySnap onLogMeal={handleLogMeal} />
              ) : (
                <MealContent
                  mealTime={meal.value as MealTime}
                  loggedMeals={loggedMeals[meal.value as MealTime] || []}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
         {/* This will render the content for /manual page */}
        {activeTab === 'manual' && children}
      </div>
    </AppShell>
  );
}
