'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Grid } from 'lucide-react';
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
import { PageHeader } from '@/components/page-header';
import { PlannedMealContent } from '@/components/planned-meal-content';
import { useSearchParams, useRouter } from 'next/navigation';

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
        &lt; {format(previousDate, 'MMM d')}
      </Button>
      <h2 className="text-2xl font-bold text-center">{formatDate(currentDate)}</h2>
      <Button variant="ghost" className="text-muted-foreground" onClick={() => onDateChange(nextDate)}>
        {format(nextDate, 'MMM d')} &gt;
      </Button>
    </div>
  );
};


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = searchParams.get('date');
    return dateParam ? new Date(dateParam) : new Date();
  });
  
  const [activeMealTab, setActiveMealTab] = useState<MealTime>('breakfast');

  useEffect(() => {
    const dateParam = searchParams.get('date');
    const newDate = dateParam ? new Date(dateParam) : new Date();
    // Only update if the date is different to avoid re-renders
    if (newDate.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(newDate);
    }
  }, [searchParams, currentDate]);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    router.push(`/dashboard?date=${newDate.toISOString().split('T')[0]}`);
  };
  
  const activeTab = isTomorrow(currentDate || new Date()) ? 'tomorrow' : 'today';


  const mealsQuery = useMemoFirebase(() => {
    if (!user || !currentDate || activeTab !== 'today') return null;

    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);

    return query(
      collection(firestore, 'users', user.uid, 'meals'),
      where('timestamp', '>=', Timestamp.fromDate(start)),
      where('timestamp', '<=', Timestamp.fromDate(end)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user, currentDate, activeTab]);

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
    { value: 'eveningSnack', label: 'Evening Snack' },
    { value: 'dinner', label: 'Dinner' },
  ];

  const activeTabLabel = activeTab === 'today' 
    ? mealTabs.find(tab => tab.value === activeMealTab)?.label || 'Diary' 
    : 'Tomorrow';

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
      <div className="flex flex-col gap-4">
        <PageHeader title={activeTabLabel} />
        
        <DateNavigator currentDate={currentDate} onDateChange={handleDateChange} />

        {activeTab === 'today' && (
          <>
            <div className="flex justify-center my-4">
              <div className="flex items-center gap-2 rounded-full bg-card p-1">
                {mealTabs.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeMealTab === filter.value ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveMealTab(filter.value as MealTime)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="w-full">
                {mealTabs.map((meal) => (
                    <div key={meal.value} className={cn(activeMealTab === meal.value ? 'block' : 'hidden' )}>
                        <MealContent
                        mealTime={meal.value as MealTime}
                        loggedMeals={loggedMeals[meal.value as MealTime] || []}
                        currentDate={currentDate}
                        />
                    </div>
                ))}
            </div>
          </>
        )}

        {activeTab === 'tomorrow' && (
          <PlannedMealContent />
        )}
      </div>
    </AppShell>
  );
}
