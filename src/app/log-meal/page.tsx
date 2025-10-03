'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const mealData = {
  breakfast: [],
  morningSnack: [
    {
      name: 'Carrot Halwa',
      recommended: '0.5 katori',
      recommendedCals: 82,
      had: '1.0 katori',
      hadCals: 164,
    },
    {
      name: 'Gulab Jamun',
      recommended: '11.5 grams',
      recommendedCals: 38,
      had: '1.0 jamun with syrup',
      hadCals: 150,
    },
    {
      name: 'Khichdi',
      recommended: '0.5 cup',
      recommendedCals: 104,
      had: '1.0 bowl',
      hadCals: 292,
    },
  ],
  lunch: [],
  eveningSnack: [],
  dinner: [],
};

type MealTime = keyof typeof mealData;

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

const MealContent = ({ mealTime }: { mealTime: MealTime }) => {
  const items = mealData[mealTime];
  const totalCals = items.reduce((sum, item) => sum + item.hadCals, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{totalCals} Cal</span>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/log-meal/manual">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Food
              </Link>
            </Button>
            <Button asChild>
              <Link href="/log-meal/snap">
                <Camera className="mr-2 h-4 w-4" /> Snap Meal
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No food logged for this meal yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 items-center gap-4">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-green-400">
                    Recommended - {item.recommended}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You had - {item.had}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">{item.recommendedCals} Cal</p>
                </div>
                 <div className="text-right">
                  <p className="font-bold">{item.hadCals} Cal</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {mealTime === 'morningSnack' && (
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
                   <div key={item.name} className="flex items-center justify-between">
                     <div className='flex items-center gap-4'>
                        <Image src={item.image} alt={item.name} width={50} height={50} className='rounded-full' />
                        <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.amount}</p>
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

export default function LogMealPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Today's Insights"
          description="Log your meals to get AI-powered insights and recommendations."
        />

        <Tabs defaultValue="morningSnack" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="morningSnack">Morning Snack</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="eveningSnack">Evening Snack</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
          </TabsList>
          <TabsContent value="breakfast">
            <MealContent mealTime="breakfast" />
          </TabsContent>
          <TabsContent value="morningSnack">
            <MealContent mealTime="morningSnack" />
          </TabsContent>
          <TabsContent value="lunch">
            <MealContent mealTime="lunch" />
          </TabsContent>
          <TabsContent value="eveningSnack">
            <MealContent mealTime="eveningSnack" />
          </TabsContent>
          <TabsContent value="dinner">
            <MealContent mealTime="dinner" />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
