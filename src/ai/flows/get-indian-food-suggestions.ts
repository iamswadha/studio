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
  ingredients: z.array(z.string()).describe('A list of ingredients for the recipe.'),
  recipe: z.array(z.string()).describe('The step-by-step cooking instructions.'),
  nutrition: z.object({
    calories: z.number().describe('Estimated calories per serving.'),
    protein: z.number().describe('Estimated protein in grams per serving.'),
    fat: z.number().describe('Estimated fat in grams per serving.'),
    carbs: z.number().describe('Estimated carbohydrates in grams per serving.'),
  }).describe('Nutritional information per serving.'),
});

const IndianFoodSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(FoodSuggestionSchema)
    .describe('A list of Indian food suggestions.'),
});
export type IndianFoodSuggestionsOutput = z.infer<
  typeof IndianFoodSuggestionsOutputSchema
>;
export type Recipe = z.infer<typeof FoodSuggestionSchema>;

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
For each suggestion, provide:
1. A realistic and appealing image URL. You must generate this image.
2. A short, one-sentence enticing description of the food.
3. A list of ingredients.
4. The step-by-step recipe.
5. Estimated nutritional information (calories, protein, fat, carbs) for a single serving.
`,
});

const indianFoodSuggestionsFlow = ai.defineFlow(
  {
    name: 'indianFoodSuggestionsFlow',
    inputSchema: IndianFoodSuggestionsInputSchema,
    outputSchema: IndianFoodSuggestionsOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const suggestions = llmResponse.output?.suggestions || [];

    const suggestionsWithImages = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `Generate a high-quality, photorealistic image of the Indian dish: ${suggestion.name}. The meal should be on a clean white plate. The image should be well-lit, appetizing, and look like it was taken for a food blog.`,
          });

          if (media.url) {
            suggestion.imageUrl = media.url;
          }
        } catch (error) {
          console.error(`Failed to generate image for ${suggestion.name}`, error);
          // Fallback to a placeholder if generation fails
          suggestion.imageUrl = `https://picsum.photos/seed/${suggestion.name.toLowerCase().replace(/\s/g, '-')}/600/400`;
        }
        return suggestion;
      })
    );

    return { suggestions: suggestionsWithImages };
  }
);
