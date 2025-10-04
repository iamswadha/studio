'use server';
/**
 * @fileOverview An AI agent that provides juice suggestions with images.
 *
 * - getJuiceSuggestions - A function that returns a list of juice suggestions.
 * - JuiceSuggestionsInput - The input type for the getJuiceSuggestions function.
 * - JuiceSuggestionsOutput - The return type for the getJuiceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JuiceSuggestionsInputSchema = z.object({
  query: z.string().describe('The search query for juice.'),
});
export type JuiceSuggestionsInput = z.infer<
  typeof JuiceSuggestionsInputSchema
>;

const JuiceSuggestionSchema = z.object({
  name: z.string().describe('The name of the juice product.'),
  description: z.string().describe('A short, catchy description of the juice.'),
  price: z.string().describe('The price of the juice, formatted as $XX.XX'),
  imageUrl: z.string().describe('A URL for an AI-generated image of the juice can.'),
  color: z.string().describe('A light background color in hex format (e.g., #FFDDC1) that complements the can design.'),
});

const JuiceSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(JuiceSuggestionSchema)
    .describe('A list of 5 juice suggestions.'),
});
export type JuiceSuggestionsOutput = z.infer<
  typeof JuiceSuggestionsOutputSchema
>;

export async function getJuiceSuggestions(
  input: JuiceSuggestionsInput
): Promise<JuiceSuggestionsOutput> {
  return juiceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'juiceSuggestionsPrompt',
  input: {schema: JuiceSuggestionsInputSchema},
  output: {schema: JuiceSuggestionsOutputSchema},
  prompt: `You are an expert product designer for a trendy beverage company.
The user is searching for juices. Based on their query: {{{query}}}, provide a list of 5 creative juice product suggestions.

For each suggestion, provide:
1.  A catchy 'name' for the juice (e.g., "Apple Juice", "Pineapple Juice").
2.  A short 'description' (max 10 words).
3.  A realistic 'price' as a string (e.g., "$12.65").
4.  An 'imageUrl'. This must be a placeholder URL from picsum.photos. The format is 'https://picsum.photos/seed/SEED/80/96' where SEED is a unique word related to the juice (e.g., 'apple', 'pineapple').
5.  A complementary light background 'color' in hex format (e.g., Apple Juice could have a light red like #FADADD, Pineapple could have #FFF6CC).
`,
});

const juiceSuggestionsFlow = ai.defineFlow(
  {
    name: 'juiceSuggestionsFlow',
    inputSchema: JuiceSuggestionsInputSchema,
    outputSchema: JuiceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
