'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from './ui/separator';

type FoodItem = {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };

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

export const MealContent = ({ mealTime, items }: { mealTime: string, items: FoodItem[] }) => {
  const totalCals = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>{mealTime.charAt(0).toUpperCase() + mealTime.slice(1).replace('Snack', ' Snack')}</span>
            <span className="text-lg font-bold">{Math.round(totalCals)} Cal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
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
          <div className="space-y-4">
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
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 items-center gap-4 pt-4">
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
          </div>
        )}

        {mealTime === 'morningSnack' && items.length > 0 && (
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
