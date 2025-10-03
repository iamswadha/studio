'use server';
/**
 * @fileOverview An AI agent that provides nutritional information for a given food item.
 *
 * - getFoodItemNutrition - A function that returns the nutritional information for a food item.
 * - FoodItemNutritionInput - The input type for the getFoodItemNutrition function.
 * - FoodItemNutritionOutput - The return type for the getFoodItemNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodItemNutritionInputSchema = z.object({
  foodItemName: z.string().describe('The name of the food item.'),
});
export type FoodItemNutritionInput = z.infer<typeof FoodItemNutritionInputSchema>;

const FoodItemNutritionOutputSchema = z.object({
  calories: z.number().describe('The estimated number of calories.'),
  protein: z.number().describe('The estimated amount of protein in grams.'),
  carbohydrates: z.number().describe('The estimated amount of carbohydrates in grams.'),
  fat: z.number().describe('The estimated amount of fat in grams.'),
});
export type FoodItemNutritionOutput = z.infer<typeof FoodItemNutritionOutputSchema>;

export async function getFoodItemNutrition(
  input: FoodItemNutritionInput
): Promise<FoodItemNutritionOutput> {
  return foodItemNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodItemNutritionPrompt',
  input: {schema: FoodItemNutritionInputSchema},
  output: {schema: FoodItemNutritionOutputSchema},
  prompt: `You are an AI assistant specialized in estimating nutritional content of food.
  Provide the estimated calories and macronutrient breakdown (protein, carbohydrates, and fat) for the following food item: {{{foodItemName}}}.
  Provide the nutritional information for a standard serving size.
  Make your best estimates. Do not ask follow up questions, simply provide the data requested in the output schema.
  `,
});

const foodItemNutritionFlow = ai.defineFlow(
  {
    name: 'foodItemNutritionFlow',
    inputSchema: FoodItemNutritionInputSchema,
    outputSchema: FoodItemNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
