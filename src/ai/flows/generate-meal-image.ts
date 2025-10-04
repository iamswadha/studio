'use server';
/**
 * @fileOverview An AI agent that generates a meal image from a list of food items.
 *
 * - generateMealImage - A function that returns a URL for a generated meal image.
 * - GenerateMealImageInput - The input type for the generateMealImage function.
 * - GenerateMealImageOutput - The return type for the generateMealImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMealImageInputSchema = z.object({
  foodItems: z
    .array(z.string())
    .describe('A list of food items in the meal.'),
});
export type GenerateMealImageInput = z.infer<
  typeof GenerateMealImageInputSchema
>;

const GenerateMealImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated meal image.'),
});
export type GenerateMealImageOutput = z.infer<
  typeof GenerateMealImageOutputSchema
>;

export async function generateMealImage(
  input: GenerateMealImageInput
): Promise<GenerateMealImageOutput> {
  return generateMealImageFlow(input);
}

const generateMealImageFlow = ai.defineFlow(
  {
    name: 'generateMealImageFlow',
    inputSchema: GenerateMealImageInputSchema,
    outputSchema: GenerateMealImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a photorealistic image of a meal on a clean, white plate. The meal consists of ${input.foodItems.join(
        ', '
      )}. The image should be well-lit, appetizing, and shot from a top-down or 45-degree angle.`,
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce a URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
