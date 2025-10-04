'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Grid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { format, startOfDay, endOfDay, addDays, subDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { MealContent } from '@/components/meal-content';
import type { LoggedMeal, MealData, MealTime } from '@/app/log-meal/layout';


const DateNavigator = ({ currentDate, onDateChange }: { currentDate: Date, onDateChange: (newDate: Date) => void }) => {
  const previousDate = subDays(currentDate, 1);
  const nextDate = addDays(currentDate, 1);

  const formatDate = (date: Date): string => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, 'MMM d');
  };

  return (
    <div className="flex items-center justify-between py-4">
      <Button variant="ghost" className="text-muted-foreground" onClick={() => onDateChange(previousDate)}>
        {formatDate(previousDate)}
      </Button>
      <h2 className="text-2xl font-bold text-center">{formatDate(currentDate)}</h2>
      <Button variant="ghost" className="text-muted-foreground" onClick={() => onDateChange(nextDate)}>
        {formatDate(nextDate)}
      </Button>
    </div>
  );
};

export default function FoodMenuPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [activeMealTab, setActiveMealTab] = useState<MealTime>('breakfast');

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const mealsQuery = useMemoFirebase(() => {
    if (!user || !currentDate) return null;

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
    const newMealData: MealData = {
        breakfast: [],
        morningSnack: [],
        lunch: [],
        eveningSnack: [],
        dinner: [],
      };
    if (mealsFromDb) {
      mealsFromDb.forEach((meal) => {
        if (newMealData[meal.mealTime]) {
          newMealData[meal.mealTime].push(meal);
        }
      });
    }
      setLoggedMeals(newMealData);
  }, [mealsFromDb]);

  const mealTabs = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morningSnack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'eveningSnack', 'label': 'Evening Snack' },
    { value: 'dinner', label: 'Dinner' },
  ];

  if (!currentDate) {
     return (
      <AppShell>
        <div className="flex flex-col gap-8">
          <header className="flex justify-between items-center">
            <h1 className="font-serif text-4xl">
              Break<span className="font-bold">fast</span>
            </h1>
            <div className="flex items-center gap-4">
              <Search className="h-6 w-6 text-muted-foreground" />
              <Grid className="h-6 w-6 text-muted-foreground" />
            </div>
          </header>
        </div>
      </AppShell>
     )
  }

  return (
    <AppShell>
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <h1 className="font-serif text-4xl">
                Break<span className="font-bold">fast</span>
                </h1>
                <div className="flex items-center gap-4">
                <Search className="h-6 w-6 text-muted-foreground" />
                <Grid className="h-6 w-6 text-muted-foreground" />
                </div>
            </header>

            <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

            <Tabs defaultValue="breakfast" orientation="vertical" className="flex flex-col md:flex-row gap-8" value={activeMealTab} onValueChange={(value) => setActiveMealTab(value as MealTime)}>
                <TabsList className="flex md:flex-col justify-start md:h-auto bg-transparent p-0 w-full md:w-48 overflow-x-auto md:overflow-visible">
                    {mealTabs.map((meal) => (
                    <TabsTrigger 
                        key={meal.value} 
                        value={meal.value}
                        className={cn(
                            "w-full justify-start text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold rounded-lg px-4 py-3"
                        )}
                    >
                        {meal.label}
                    </TabsTrigger>
                    ))}
                </TabsList>

                <div className="flex-1 w-full">
                    {mealTabs.map((meal) => (
                        <TabsContent key={meal.value} value={meal.value} className="mt-0">
                            <MealContent
                            mealTime={meal.value as MealTime}
                            loggedMeals={loggedMeals[meal.value as MealTime] || []}
                            currentDate={currentDate}
                            />
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    </AppShell>
  );
}
