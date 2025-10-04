'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Camera, Pencil, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from './ui/separator';
import type { LoggedMeal, MealTime } from '@/app/log-meal/layout';
import { useFirestore, useUser, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, Timestamp } from 'firebase/firestore';
import { FoodSearchCombobox } from './food-search-combobox';
import { getSingleItemNutrition } from '@/lib/actions';
import { useState } from 'react';
import { startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


const suggestions = [
  {
    name: 'Almond',
    amount: '9.0 almond',
    cals: 67,
    image: 'https://picsum.photos/seed/almond/100/100',
  },
  {
    name: 'Apple',
    amount: '1.0 cup, quartered or chopped',
    cals: 74,
    image: 'https://picsum.photos/seed/apple/100/100',
  },
];

export const MealContent = ({ mealTime, loggedMeals, currentDate }: { mealTime: MealTime, loggedMeals: LoggedMeal[], currentDate: Date }) => {
  const totalCals = loggedMeals.reduce((sum, meal) => sum + meal.totalNutrition.calories, 0);
  const { user } = useUser();
  const firestore = useFirestore();
  const dateParam = currentDate.toISOString();
  const { toast } = useToast();
  const [isAddingFood, setIsAddingFood] = useState(false);

  const handleDeleteMeal = (mealId: string) => {
    if (!user) return;
    const mealDocRef = doc(firestore, 'users', user.uid, 'meals', mealId);
    deleteDocumentNonBlocking(mealDocRef);
  };

  const handleAddFood = async (suggestion: { name: string, imageUrl: string }) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to log a meal.',
      });
      return;
    }
    setIsAddingFood(true);
    
    const nutrition = await getSingleItemNutrition({ foodItemName: suggestion.name });
    if (!nutrition.success || !nutrition.data) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch nutrition data for this item.',
        });
        setIsAddingFood(false);
        return;
    }

    const mealTimestamp = startOfDay(currentDate);

    const newMeal: Omit<LoggedMeal, 'id'> & { userId: string } = {
      mealTime: mealTime,
      items: [
        {
          id: Date.now(),
          name: suggestion.name,
          calories: nutrition.data.calories,
          protein: nutrition.data.protein,
          carbohydrates: nutrition.data.carbohydrates,
          fat: nutrition.data.fat,
          imageUrl: suggestion.imageUrl,
        },
      ],
      totalNutrition: {
        calories: nutrition.data.calories,
        protein: nutrition.data.protein,
        carbohydrates: nutrition.data.carbohydrates,
        fat: nutrition.data.fat,
      },
      // Note: imageUrl for the whole meal is not set here, as it's an individual item
      userId: user.uid,
      timestamp: Timestamp.fromDate(mealTimestamp),
    };

    const mealsCol = collection(firestore, 'users', user.uid, 'meals');
    addDocumentNonBlocking(mealsCol, newMeal);
    
    toast({
      title: 'Meal Logged!',
      description: `${suggestion.name} has been added to your ${mealTime} log.`,
    });
    setIsAddingFood(false);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span className="capitalize">{mealTime.replace('Snack', ' Snack')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loggedMeals.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 space-y-4">
            <p className="text-4xl font-bold">{Math.round(totalCals)} <span className="text-lg text-muted-foreground">Cal</span></p>
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className='w-full max-w-xs'>
                    {isAddingFood ? (
                        <div className='flex items-center justify-center gap-2'><Loader2 className="h-4 w-4 animate-spin" /> Adding...</div>
                    ): (
                        <FoodSearchCombobox onSelect={handleAddFood} />
                    )}
                </div>
                <Button asChild className="w-full max-w-xs">
                <Link href={`/log-meal/healthify-snap?date=${dateParam}`}>
                    <Camera className="mr-2 h-4 w-4" /> Snap Meal
                </Link>
                </Button>
            </div>
            <p>No food logged for this meal yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <p className="text-2xl font-bold">{Math.round(totalCals)} <span className="text-lg text-muted-foreground">Cal</span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className='w-full max-w-xs'>
                         {isAddingFood ? (
                            <div className='flex items-center justify-center gap-2'><Loader2 className="h-4 w-4 animate-spin" /> Adding...</div>
                        ): (
                            <FoodSearchCombobox onSelect={handleAddFood} />
                        )}
                    </div>
                    <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/log-meal/healthify-snap?date=${dateParam}`}>
                        <Camera className="mr-2 h-4 w-4" /> Snap Meal
                    </Link>
                    </Button>
                </div>
            </div>
            {loggedMeals.map((meal) => (
              <div key={meal.id}>
                <Separator />
                <div className="flex flex-col sm:flex-row justify-between items-start pt-6 gap-4">
                  <div className="flex-grow flex flex-col md:flex-row items-start gap-4 w-full">
                    {meal.imageUrl && (
                      <div className="w-full md:w-40 flex-shrink-0">
                        <Image
                          src={meal.imageUrl}
                          alt="Logged meal"
                          width={150}
                          height={150}
                          className="rounded-lg object-cover aspect-square w-full"
                        />
                      </div>
                    )}
                    <div className='w-full space-y-3'>
                      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <div>
                            <p className="font-bold">Total Nutrition</p>
                            <p className="text-sm text-muted-foreground">
                                {Math.round(meal.totalNutrition.protein)}g P, {Math.round(meal.totalNutrition.carbohydrates)}g C, {Math.round(meal.totalNutrition.fat)}g F
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">{Math.round(meal.totalNutrition.calories)} Cal</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        {meal.items.map(item => (
                           <div key={item.id} className="flex items-center justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="text-xs text-muted-foreground">{Math.round(item.calories)} kcal</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col self-start shrink-0">
                      <Button size="icon" variant="ghost" className="h-8 w-8" disabled>
                          <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteMeal(meal.id)}
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
              </div>
              ))}
          </div>
        )}

        {mealTime === 'morningSnack' && loggedMeals.length > 0 && (
          <>
            <div className="my-6 p-4 bg-card-foreground/5 rounded-lg text-center">
              <p className="font-semibold mb-2">Was this insight helpful?</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline">No</Button>
                <Button>Yes</Button>
              </div>
            </div>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Morning Snack Suggestion</span>
                  <span className="text-lg font-bold">141 Cal</span>
                </CardTitle>
                <CardDescription>
                  You were not able to achieve the balance you would've hoped
                  for. Don't worry, here's my suggestion for what you can have
                  instead of the Morning Snack you've just had.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.amount}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">{item.cals} Cal</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
};
