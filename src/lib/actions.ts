'use server';

import {
  logMealsWithHealthifySnap,
  type LogMealsWithHealthifySnapInput,
} from '@/ai/flows/log-meals-with-healthify-snap';

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
