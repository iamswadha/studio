'use server';
/**
 * @fileOverview An AI agent that provides Indian food suggestions with images.
 *
 * - getIndianFoodSuggestions - A function that returns a list of Indian food suggestions.
 * - IndianFoodSuggestionsInput - The input type for the getIndianFoodSuggestions function.
 * - IndianFoodSuggestionsOutput - The return type for the getIndianFoodSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IndianFoodSuggestionsInputSchema = z.object({
  query: z.string().describe('The search query for Indian food.'),
});
export type IndianFoodSuggestionsInput = z.infer<
  typeof IndianFoodSuggestionsInputSchema
>;

const FoodSuggestionSchema = z.object({
  name: z.string().describe('The name of the Indian food item.'),
  imageUrl: z.string().describe('A URL for an image of the food item.'),
  description: z.string().describe('A short, enticing description of the food item.'),
});

const IndianFoodSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(FoodSuggestionSchema)
    .describe('A list of Indian food suggestions.'),
});
export type IndianFoodSuggestionsOutput = z.infer<
  typeof IndianFoodSuggestionsOutputSchema
>;

export async function getIndianFoodSuggestions(
  input: IndianFoodSuggestionsInput
): Promise<IndianFoodSuggestionsOutput> {
  return indianFoodSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'indianFoodSuggestionsPrompt',
  input: {schema: IndianFoodSuggestionsInputSchema},
  output: {schema: IndianFoodSuggestionsOutputSchema},
  prompt: `You are an expert on Indian cuisine. The user is searching for Indian food items.
Based on their query: {{{query}}}, provide a list of 5 relevant Indian food suggestions.
For each suggestion, provide a realistic and appealing image URL and a short, one-sentence enticing description of the food. You can use Unsplash for images.
`,
});

const indianFoodSuggestionsFlow = ai.defineFlow(
  {
    name: 'indianFoodSuggestionsFlow',
    inputSchema: IndianFoodSuggestionsInputSchema,
    outputSchema: IndianFoodSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
