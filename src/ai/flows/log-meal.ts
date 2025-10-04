'use server';
/**
 * @fileOverview A flow for logging a meal to Firestore.
 *
 * - logMealFlow - A function that logs a meal, creating or updating a document as needed.
 */
import { ai } from '@/ai/genkit';
import { getFirebase } from '@/firebase-server';
import {
  collection,
  query,
  where,
  Timestamp,
  getDocs,
  writeBatch,
  doc,
  addDoc,
} from 'firebase/firestore';
import { z } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';

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
  imageUrl: z.string().optional().describe('An optional image URL for the meal.'),
});

export type LogMealInput = z.infer<typeof LogMealInputSchema>;

export const logMealFlow = ai.defineFlow(
  {
    name: 'logMealFlow',
    inputSchema: LogMealInputSchema,
    outputSchema: z.object({ success: z.boolean(), docId: z.string().optional() }),
  },
  async (input) => {
    const { firestore } = await getFirebase();
    const { userId, mealTime, date, items, imageUrl } = input;

    const mealDate = new Date(date);
    const start = startOfDay(mealDate);
    const end = endOfDay(mealDate);

    const mealsCol = collection(firestore, 'users', userId, 'meals');

    // Query for existing meal documents for that user, mealtime, and day.
    const q = query(
      mealsCol,
      where('userId', '==', userId),
      where('mealTime', '==', mealTime),
      where('timestamp', '>=', Timestamp.fromDate(start)),
      where('timestamp', '<=', Timestamp.fromDate(end))
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No existing meal for this slot, create a new one.
      const totalNutrition = items.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbohydrates: acc.carbohydrates + item.carbohydrates,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
      );

      const newMeal = {
        userId,
        mealTime,
        timestamp: Timestamp.fromDate(mealDate),
        items,
        totalNutrition,
        imageUrl: imageUrl || items[0]?.imageUrl || '',
      };
      
      const docRef = await addDoc(mealsCol, newMeal);
      return { success: true, docId: docRef.id };

    } else {
      // Existing meal found, update it.
      // We'll merge all items and update the first document.
      // If there are multiple documents (which shouldn't happen), we'll merge them.
      const batch = writeBatch(firestore);
      const firstDoc = querySnapshot.docs[0];
      const firstDocRef = doc(firestore, 'users', userId, 'meals', firstDoc.id);

      const existingData = firstDoc.data();
      const combinedItems = [...existingData.items, ...items];
      
      const totalNutrition = combinedItems.reduce(
        (acc, item) => ({
          calories: acc.calories + (item.calories || 0),
          protein: acc.protein + (item.protein || 0),
          carbohydrates: acc.carbohydrates + (item.carbohydrates || 0),
          fat: acc.fat + (item.fat || 0),
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
      );

      batch.update(firstDocRef, {
        items: combinedItems,
        totalNutrition,
        // Update imageUrl if a new one is provided for the whole meal
        ...(imageUrl && { imageUrl: imageUrl }),
      });
      
      // If by some mistake there are multiple docs, merge them into the first and delete the rest.
      if (querySnapshot.docs.length > 1) {
        for(let i = 1; i < querySnapshot.docs.length; i++) {
            const redundantDocRef = doc(firestore, 'users', userId, 'meals', querySnapshot.docs[i].id);
            batch.delete(redundantDocRef);
        }
      }

      await batch.commit();
      return { success: true, docId: firstDoc.id };
    }
  }
);
