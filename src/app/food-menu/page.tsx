'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FoodCard } from '@/components/food-card';
import { getFoodSuggestions } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { LoggedMeal, MealData, MealTime } from '@/app/log-meal/layout';


const categories = ['Bread', 'Noodles', 'Seafood', 'Pizza', 'Pasta'];

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
  const { data: foodSuggestions, isLoading } = useQuery({
    queryKey: ['foodSuggestions'],
    queryFn: () => getFoodSuggestions({ query: 'healthy food' }),
  });

  const [activeCategory, setActiveCategory] = useState('Bread');
  const [activeFilter, setActiveFilter] = useState('breakfast');

  const { user } = useUser();
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize date on the client to avoid hydration mismatch
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
      setLoggedMeals({
        breakfast: [],
        morningSnack: [],
        lunch: [],
        eveningSnack: [],
        dinner: [],
      });
    }
  }, [mealsFromDb]);

  const mealTabs = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morningSnack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'eveningSnack', label: 'Evening Snack' },
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
          <Skeleton className="w-full h-[500px]" />
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

        <div className="flex gap-8">
          <nav className="flex flex-col gap-8 pt-20">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'font-medium text-muted-foreground -rotate-90 origin-center whitespace-nowrap transition-colors',
                  activeCategory === category && 'text-primary'
                )}
              >
                {category}
              </button>
            ))}
          </nav>

          <main className="flex-1 flex flex-col gap-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-10">
                  {foodSuggestions?.data?.suggestions.map((food, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-3/4 pl-10"
                    >
                      <FoodCard
                        name={food.name}
                        description="A salad is a dish consisting of a mixture of small pieces of food, usually vegetables."
                        image={food.imageUrl}
                        imageHint="plated food"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            )}

            <div className="flex justify-center items-center gap-4">
              {mealTabs.map((meal) => (
                <Button
                  key={meal.value}
                  variant={activeFilter === meal.value ? 'default' : 'ghost'}
                  className={cn(
                    'rounded-full px-6',
                    activeFilter === meal.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground'
                  )}
                  onClick={() => setActiveFilter(meal.value)}
                >
                  {meal.label}
                </Button>
              ))}
            </div>
          </main>
        </div>

        <div id="diary" className="pt-8">
          <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />
        
          <Tabs defaultValue="breakfast" className="w-full mt-4">
            <div className="flex justify-between items-center mb-4 gap-4">
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
            </div>

            {mealTabs.map((meal) => (
              <TabsContent key={meal.value} value={meal.value} className="mt-4">
                <MealContent
                  mealTime={meal.value as MealTime}
                  loggedMeals={loggedMeals[meal.value as MealTime] || []}
                  currentDate={currentDate}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}
