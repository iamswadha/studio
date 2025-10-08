'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { startOfTomorrow, format } from 'date-fns';
import type { PlannedMeal } from '@/app/log-meal/layout';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const PlannedMealContent = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const plannedMealsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const tomorrow = startOfTomorrow();
    return query(
      collection(firestore, 'users', user.uid, 'plannedMeals'),
      where('planDate', '>=', Timestamp.fromDate(tomorrow)),
      where('planDate', '<', Timestamp.fromDate(new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)))
    );
  }, [user, firestore]);

  const { data: plannedMeals, isLoading } = useCollection<PlannedMeal>(plannedMealsQuery);

  const handleLogNow = (meal: PlannedMeal) => {
    // This is a placeholder for the functionality to log a planned meal.
    // In a real implementation, this would likely open a modal or navigate
    // to a page to confirm the details and log it as a real meal.
    toast({
      title: 'Ready to Log!',
      description: `You can now log "${meal.name}" to your diary.`,
    });
  };

  if (isUserLoading) {
      return (
          <div className="flex h-full items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meals for Tomorrow</CardTitle>
        <CardDescription>
          Here are the meals you've planned for {format(startOfTomorrow(), 'EEEE, MMMM d')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && (!plannedMeals || plannedMeals.length === 0) && (
          <div className="text-center text-muted-foreground py-8 space-y-4">
            <Utensils className="mx-auto h-12 w-12" />
            <h3 className="font-semibold text-lg">No Meals Planned Yet</h3>
            <p>Looks like you haven't planned any meals for tomorrow.</p>
            <Button asChild>
              <Link href="/food-menu">
                <Plus className="mr-2 h-4 w-4" /> Discover Recipes
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && plannedMeals && plannedMeals.length > 0 && (
          <ul className="space-y-4">
            {plannedMeals.map((meal) => (
              <li
                key={meal.id}
                className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={meal.imageUrl}
                    alt={meal.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover aspect-square"
                  />
                  <div>
                    <p className="font-bold">{meal.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{meal.description}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleLogNow(meal)}>
                  Log Now
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
