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
      "A photo of the meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'" // Corrected the expected format
    ),
});
export type LogMealsWithHealthifySnapInput = z.infer<typeof LogMealsWithHealthifySnapInputSchema>;

const FoodItemSchema = z.object({
    name: z.string().describe('The most likely name of the food item.'),
    suggestions: z.array(z.string()).describe('A list of up to 3 alternative names or more specific descriptions for the food item.'),
});

const LogMealsWithHealthifySnapOutputSchema = z.object({
  calories: z.number().describe('The estimated total number of calories in the meal.'),
  nutrients: z
    .object({
      protein: z.number().describe('The estimated total amount of protein in grams.'),
      carbohydrates: z.number().describe('The estimated total amount of carbohydrates in grams.'),
      fat: z.number().describe('The estimated total amount of fat in grams.'),
    })
    .describe('The estimated total macronutrient breakdown of the meal.'),
  foodItems: z.array(z.string()).describe('A list of the most likely food items identified in the photo.'),
  foodItemsWithSuggestions: z.array(FoodItemSchema).describe('A list of identified food items, each with a primary name and a list of alternative suggestions.'),
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

  Analyze the photo of the meal provided. Identify all the distinct food items present.
  If you cannot identify any food items in the image, return an empty list for foodItems and zero for all nutritional values.
  For each item, determine its most likely name. Also, suggest up to 3 alternative or more specific names.
  Then, estimate the total calorie count and macronutrient breakdown (protein, carbohydrates, and fat) for the entire meal.

  Photo: {{media url=photoDataUri}}

  Respond with the estimated total calories, total macronutrient breakdown, and a list of the most likely names for the identified food items, along with their suggestions.
  Make your best estimates. Be as accurate as possible. Do not ask follow up questions, simply provide the data requested in the output schema.
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
