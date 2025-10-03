'use server';

/**
 * @fileOverview An AI agent that allows users to log their meals by taking a photo, with the system estimating the calories and nutrients of the food they're eating.
 *
 * - logMealsWithHealthifySnap - A function that handles the meal logging process with HealthifySnap.
 * - LogMealsWithHealthifySnapInput - The input type for the logMealsWithHealthifySnap function.
 * - LogMealsWithHealthifySnapOutput - The return type for the logMealsWithHealthifySnap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogMealsWithHealthifySnapInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format
    ),
});
export type LogMealsWithHealthifySnapInput = z.infer<typeof LogMealsWithHealthifySnapInputSchema>;

const LogMealsWithHealthifySnapOutputSchema = z.object({
  calories: z.number().describe('The estimated number of calories in the meal.'),
  nutrients: z
    .object({
      protein: z.number().describe('The estimated amount of protein in grams.'),
      carbohydrates: z.number().describe('The estimated amount of carbohydrates in grams.'),
      fat: z.number().describe('The estimated amount of fat in grams.'),
    })
    .describe('The estimated macronutrient breakdown of the meal.'),
  foodItems: z.array(z.string()).describe('A list of food items identified in the photo.'),
});
export type LogMealsWithHealthifySnapOutput = z.infer<typeof LogMealsWithHealthifySnapOutputSchema>;

export async function logMealsWithHealthifySnap(
  input: LogMealsWithHealthifySnapInput
): Promise<LogMealsWithHealthifySnapOutput> {
  return logMealsWithHealthifySnapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'logMealsWithHealthifySnapPrompt',
  input: {schema: LogMealsWithHealthifySnapInputSchema},
  output: {schema: LogMealsWithHealthifySnapOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing meal photos and estimating their nutritional content.

  Analyze the photo of the meal provided. Identify the food items present and estimate the calorie count and macronutrient breakdown (protein, carbohydrates, and fat).

  Photo: {{media url=photoDataUri}}

  Respond with the estimated calories, macronutrient breakdown, and a list of identified food items.
  Make your best estimates. If a particular food item is hard to identify, make a reasonable guess.
  Be as accurate as possible. Do not ask follow up questions, simply provide the data requested in the output schema.
  `,
});

const logMealsWithHealthifySnapFlow = ai.defineFlow(
  {
    name: 'logMealsWithHealthifySnapFlow',
    inputSchema: LogMealsWithHealthifySnapInputSchema,
    outputSchema: LogMealsWithHealthifySnapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
