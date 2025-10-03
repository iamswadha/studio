'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MealContent } from '@/components/meal-content';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { format, startOfDay, endOfDay, addDays, isToday, isYesterday } from 'date-fns';

export type FoodItem = {
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
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const mealsQuery = useMemoFirebase(() => {
    if (!user) return null;

    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);

    return query(
      collection(firestore, 'users', user.uid, 'meals'),
      where('timestamp', '>=', Timestamp.fromDate(start)),
      where('timestamp', '<=', Timestamp.fromDate(end)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user, currentDate]);

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

  const handleDateChange = (daysToAdd: number) => {
    setCurrentDate(prevDate => addDays(prevDate, daysToAdd));
  };
  
  const getPageTitle = () => {
    if(isToday(currentDate)) return "Today's Insights";
    if(isYesterday(currentDate)) return "Yesterday's Insights";
    if(currentDate > new Date() && !isToday(currentDate)) return "Tomorrow's Plan";
    return format(currentDate, 'MMMM d, yyyy');
  }

  const mealTabs = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morningSnack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'eveningSnack', label: 'Evening Snack' },
    { value: 'dinner', label: 'Dinner' },
  ];

  const activeTabValue = pathname.split('/').pop();
  const isDedicatedPage = ['manual', 'healthify-snap'].includes(
    activeTabValue ?? ''
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {!isDedicatedPage && (
          <PageHeader
            title={getPageTitle()}
            description="Log your meals to get AI-powered insights and recommendations."
          >
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-28 text-center">{format(currentDate, 'MMM d')}</span>
              <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </PageHeader>
        )}

        {isDedicatedPage ? (
          children
        ) : (
          <Tabs defaultValue="breakfast" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex">
                  {mealTabs.map((meal) => (
                    <TabsTrigger key={meal.value} value={meal.value}>
                      {meal.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="flex gap-2 ml-2 shrink-0">
                <Button variant="outline" asChild>
                  <Link href="/log-meal/manual">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Food
                  </Link>
                </Button>
                 <Button asChild>
                  <Link href="/log-meal/healthify-snap">
                    <Camera className="mr-2 h-4 w-4" /> Snap Meal
                  </Link>
                </Button>
              </div>
            </div>

            {mealTabs.map((meal) => (
              <TabsContent key={meal.value} value={meal.value} className="mt-4">
                <MealContent
                  mealTime={meal.value as MealTime}
                  loggedMeals={loggedMeals[meal.value as MealTime] || []}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
