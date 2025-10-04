'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getIndianFoodSuggestions, planMealForTomorrow } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { startOfTomorrow, format } from 'date-fns';
import type { PlannedMeal } from '@/app/log-meal/layout';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Recipe } from '@/ai/flows/get-indian-food-suggestions';
import { RecipeView } from '@/components/recipe-view';

const mealCategories = [
  { name: 'Sugar-Free' },
  { name: 'Oil-Free' },
  { name: 'High-Fiber' },
  { name: 'Vegan' },
  { name: 'Gluten-Free' },
];

function PlannedMeals() {
  const { user } = useUser();
  const firestore = useFirestore();

  const plannedMealsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const tomorrow = startOfTomorrow();
    return query(
      collection(firestore, 'users', user.uid, 'plannedMeals'),
      where('planDate', '==', Timestamp.fromDate(tomorrow))
    );
  }, [user, firestore]);

  const { data: plannedMeals, isLoading } = useCollection<PlannedMeal>(plannedMealsQuery);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!plannedMeals || plannedMeals.length === 0) {
    return null;
  }

  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle>Planned for Tomorrow</CardTitle>
        <CardDescription>
          {format(startOfTomorrow(), 'EEEE, MMMM d')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plannedMeals.map((meal) => (
            <li
              key={meal.id}
              className="flex items-center justify-between bg-background p-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={meal.imageUrl}
                  alt={meal.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <span className="font-medium">{meal.name}</span>
              </div>
              <Button variant="ghost" size="sm" disabled>Added</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


export default function FoodMenuPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('healthy');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: foodSuggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['food-suggestions-indian', debouncedSearchQuery],
    queryFn: () => getIndianFoodSuggestions({ query: debouncedSearchQuery }),
    enabled: debouncedSearchQuery.length > 0,
  });

  const handleSaveForTomorrow = async (meal: Recipe) => {
    const result = await planMealForTomorrow(meal);
    if (result.success) {
      toast({
        title: 'Meal Planned!',
        description: `${meal.name} has been added to your plan for tomorrow.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Discover Recipes"
          description="Find inspiration for your next healthy meal."
        />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for recipes like 'rajma chawal'..." 
            className="pl-10 !h-12"
            value={searchQuery === 'healthy' ? '' : searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {mealCategories.map((cat) => (
            <Button
              key={cat.name}
              variant="secondary"
              className="rounded-full shrink-0"
              onClick={() => setSearchQuery(cat.name)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
        
        <PlannedMeals />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingSuggestions &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}

          {foodSuggestions?.data?.suggestions.map((food, index) => (
            <Card key={index} className="overflow-hidden flex flex-col">
              <CardContent className="p-0 relative">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <CardHeader className='flex-grow'>
                <CardTitle>{food.name}</CardTitle>
                <CardDescription className="line-clamp-2">{food.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeView recipe={food} onPlan={handleSaveForTomorrow} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
