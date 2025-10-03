'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Camera, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from './ui/separator';
import type { LoggedMeal } from '@/app/log-meal/layout';

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

export const MealContent = ({ mealTime, loggedMeals }: { mealTime: string, loggedMeals: LoggedMeal[] }) => {
  const totalCals = loggedMeals.reduce((sum, meal) => sum + meal.totalNutrition.calories, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span className="capitalize">{mealTime.replace('Snack', ' Snack')}</span>
            <span className="text-lg font-bold">{Math.round(totalCals)} Cal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loggedMeals.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 space-y-4">
             <div className="flex justify-center items-center gap-4">
                <Button asChild variant="outline">
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
            <p>No food logged for this meal yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-end items-center gap-2 mb-4">
                <Button asChild variant="outline">
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
            <Separator />
            <div className="relative pl-8">
              <div className="absolute left-[1px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
              {loggedMeals.map((meal, index) => (
                <div key={meal.id} className="relative mb-8">
                   <div className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-primary border-4 border-background -translate-x-1/2"></div>
                   <div className="flex items-center gap-2 mb-2">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <p className="font-semibold text-sm">{meal.timestamp}</p>
                   </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <div className="col-span-1">
                      {meal.imageUrl && (
                        <Image
                          src={meal.imageUrl}
                          alt="Logged meal"
                          width={150}
                          height={150}
                          className="rounded-lg object-cover aspect-square"
                        />
                      )}
                    </div>
                    <div className='col-span-2 space-y-3'>
                        {meal.items.map(item => (
                            <div key={item.id} className="grid grid-cols-2 items-center gap-4">
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {Math.round(item.protein)}g P, {Math.round(item.carbohydrates)}g C, {Math.round(item.fat)}g F
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{Math.round(item.calories)} Cal</p>
                                </div>
                            </div>
                        ))}
                        <Separator />
                         <div className="text-right font-bold">
                            Total: {Math.round(meal.totalNutrition.calories)} Cal
                        </div>
                    </div>
                  </div>
                   {index < loggedMeals.length -1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
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
