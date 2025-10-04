'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  imageUrl?: string;
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

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
            title="Diary"
            description="This is where your meal diary used to be. It has been moved to the Home page."
          />
          <div className="text-center text-muted-foreground py-8">
            <p>The meal diary has been moved to the Home page.</p>
          </div>
        {children}
      </div>
    </AppShell>
  );
}
