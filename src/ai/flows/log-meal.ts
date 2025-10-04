'use server';
/**
 * @fileOverview A flow for logging a meal to Firestore.
 *
 * - logMealFlow - A function that logs a meal, creating a new document for each log.
 */
import { ai } from '@/ai/genkit';
import { getFirebase } from '@/firebase-server';
import {
  collection,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { z } from 'zod';
import { generateMealImage } from './generate-meal-image';

const FoodItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
  imageUrl: z.string().optional(),
});

const LogMealInputSchema = z.object({
  userId: z.string().describe('The UID of the user logging the meal.'),
  mealTime: z
    .enum(['breakfast', 'morningSnack', 'lunch', 'eveningSnack', 'dinner'])
    .describe('The time of day for the meal.'),
  date: z.string().describe('The ISO date string for the meal log.'),
  items: z.array(FoodItemSchema).describe('The food items in the meal.'),
});

export type LogMealInput = z.infer<typeof LogMealInputSchema>;

export const logMealFlow = ai.defineFlow(
  {
    name: 'logMealFlow',
    inputSchema: LogMealInputSchema,
    outputSchema: z.object({ success: z.boolean(), docId: z.string() }),
  },
  async (input) => {
    const { firestore } = await getFirebase();
    const { userId, mealTime, date, items } = input;

    const mealDate = new Date(date);
    const mealsCol = collection(firestore, 'users', userId, 'meals');

    // Generate a new image for the meal
    const foodItemNames = items.map(item => item.name);
    const imageResult = await generateMealImage({ foodItems: foodItemNames });
    
    const totalNutrition = items.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbohydrates: acc.carbohydrates + (item.carbohydrates || 0),
        fat: acc.fat + (item.fat || 0),
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );

    const newMeal = {
      userId,
      mealTime,
      timestamp: Timestamp.fromDate(mealDate),
      items,
      totalNutrition,
      imageUrl: imageResult.imageUrl,
    };
    
    const docRef = await addDoc(mealsCol, newMeal);
    
    return { success: true, docId: docRef.id };
  }
);
