'use server';

import {
  logMealsWithHealthifySnap,
  type LogMealsWithHealthifySnapInput,
} from '@/ai/flows/log-meals-with-healthify-snap';
import {
  getFoodItemNutrition,
  type FoodItemNutritionInput,
} from '@/ai/flows/get-food-item-nutrition';
import {
  getFoodSuggestions as getFoodSuggestionsFlow,
  type FoodSuggestionsInput,
} from '@/ai/flows/get-food-suggestions';
import {
  getIndianFoodSuggestions as getIndianFoodSuggestionsFlow,
  type IndianFoodSuggestionsInput,
  type IndianFoodSuggestionsOutput,
  type Recipe,
} from '@/ai/flows/get-indian-food-suggestions';
import {
  generateMealImage,
  type GenerateMealImageInput,
} from '@/ai/flows/generate-meal-image';
import { getFirebase } from '@/firebase-server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { startOfTomorrow } from 'date-fns';
import { headers } from 'next/headers';
import { logMealFlow, type LogMealInput } from '@/ai/flows/log-meal';


export async function getMealAnalysis(input: LogMealsWithHealthifySnapInput) {
  try {
    const result = await logMealsWithHealthifySnap(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getMealAnalysis:', error);
    // In a real app, you might want to log this error to a monitoring service.
    return {
      success: false,
      error: 'Failed to analyze meal. The AI model might be unavailable. Please try again later.',
    };
  }
}

export async function getSingleItemNutrition(input: FoodItemNutritionInput) {
  try {
    const result = await getFoodItemNutrition(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getSingleItemNutrition:', error);
    return {
      success: false,
      error:
        'Failed to get nutrition data. The AI model might be unavailable. Please try again later.',
    };
  }
}

export async function getFoodSuggestions(input: FoodSuggestionsInput) {
  try {
    const result = await getFoodSuggestionsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getFoodSuggestions:', error);
    return {
      success: false,
      error: 'Failed to get food suggestions. The AI model might be unavailable. Please try again later.',
    };
  }
}

export async function getIndianFoodSuggestions(
  input: IndianFoodSuggestionsInput
): Promise<{ success: boolean, data?: IndianFoodSuggestionsOutput, error?: string }> {
  try {
    const result = await getIndianFoodSuggestionsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getIndianFoodSuggestions:', error);
    return {
      success: false,
      error:
        'Failed to get Indian food suggestions. The AI model might be unavailable. Please try again later.',
    };
  }
}

export async function generateMealImageAction(input: GenerateMealImageInput) {
  try {
    const result = await generateMealImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateMealImageAction:', error);
    return {
      success: false,
      error: 'Failed to generate meal image. Please try again later.',
    };
  }
}


export async function planMealForTomorrow(meal: Recipe) {
    try {
        const { auth, firestore } = await getFirebase();
        
        const headersList = headers();
        const userToken = headersList.get('X-Firebase-AppCheck');

        if (!userToken) {
           return { success: false, error: "You must be logged in to plan a meal." };
        }
        
        const decodedToken = await auth.verifyIdToken(userToken);
        const user = await auth.getUser(decodedToken.uid);

        if (!user) {
            return { success: false, error: "You must be logged in to plan a meal." };
        }

        const mealToPlan = {
            userId: user.uid,
            name: meal.name,
            imageUrl: meal.imageUrl,
            description: meal.description,
            planDate: Timestamp.fromDate(startOfTomorrow()),
            createdAt: Timestamp.now(),
        };

        const plannedMealsCol = collection(firestore, 'users', user.uid, 'plannedMeals');
        await addDoc(plannedMealsCol, mealToPlan);

        return { success: true };
    } catch (error: any) {
        console.error("Error planning meal:", error);
        const errorMessage = error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')
            ? 'Server is not configured for this action. Please set the FIREBASE_SERVICE_ACCOUNT_KEY in your environment.'
            : 'Could not save the planned meal. Please try again.';
        return { success: false, error: errorMessage };
    }
}

export async function logMeal(input: Omit<LogMealInput, 'userId'>) {
    try {
        const { auth } = await getFirebase();
        const headersList = headers();
        const userToken = headersList.get('X-Firebase-AppCheck');
        if (!userToken) {
            throw new Error('User is not authenticated.');
        }
        const decodedToken = await auth.verifyIdToken(userToken);
        
        return await logMealFlow({ ...input, userId: decodedToken.uid });
    } catch (error: any) {
         console.error("Error logging meal:", error);
         const errorMessage = error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')
            ? 'Server is not configured for this action. Please set the FIREBASE_SERVICE_ACCOUNT_KEY in your environment.'
            : 'Could not save the meal. Please try again.';
        // We need to return a compatible structure for the client-side logic that calls this.
        return { success: false, error: errorMessage };
    }
}
