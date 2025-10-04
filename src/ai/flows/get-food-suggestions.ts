'use server';
/**
 * @fileOverview An AI agent that provides food suggestions with images.
 *
 * - getFoodSuggestions - A function that returns a list of food suggestions.
 * - FoodSuggestionsInput - The input type for the getFoodSuggestions function.
 * - FoodSuggestionsOutput - The return type for the getFoodSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodSuggestionsInputSchema = z.object({
  query: z.string().describe('The search query for food.'),
});
export type FoodSuggestionsInput = z.infer<
  typeof FoodSuggestionsInputSchema
>;

const FoodSuggestionSchema = z.object({
  name: z.string().describe('The name of the food item.'),
  imageUrl: z.string().describe('A URL for an image of the food item.'),
});

const FoodSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(FoodSuggestionSchema)
    .describe('A list of food suggestions.'),
});
export type FoodSuggestionsOutput = z.infer<
  typeof FoodSuggestionsOutputSchema
>;

export async function getFoodSuggestions(
  input: FoodSuggestionsInput
): Promise<FoodSuggestionsOutput> {
  return foodSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodSuggestionsPrompt',
  input: {schema: FoodSuggestionsInputSchema},
  output: {schema: FoodSuggestionsOutputSchema},
  prompt: `You are an expert on food and nutrition. The user is searching for food items.
Based on their query: {{{query}}}, provide a list of 5 relevant food suggestions.
This can include fruits, vegetables, cooked meals, etc.
For each suggestion, provide a URL for an aesthetic, 3D-style PNG image of the food item on a transparent background, suitable for a modern UI. You can use DALL-E 3 prompts that would generate such an image, and use a placeholder image service that can fulfill these prompts.
`,
});

const foodSuggestionsFlow = ai.defineFlow(
  {
    name: 'foodSuggestionsFlow',
    inputSchema: FoodSuggestionsInputSchema,
    outputSchema: FoodSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
