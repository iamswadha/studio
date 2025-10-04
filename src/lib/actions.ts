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
} from '@/ai/flows/get-indian-food-suggestions';
import {
  generateMealImage,
  type GenerateMealImageInput,
} from '@/ai/flows/generate-meal-image';

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
) {
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
