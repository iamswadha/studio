'use server';
/**
 * @fileOverview An AI agent that provides personalized health and fitness recommendations.
 *
 * - getPersonalizedRecommendations - A function that returns personalized insights and suggestions.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  activityLogs: z.string().describe('The user activity logs, including steps, workouts, and activity data.'),
  foodLogs: z.string().describe('The user food logs, including meals and macronutrient breakdown.'),
  healthData: z.string().describe('The user health data, including name, age, gender, height, and weight.'),
  fitnessGoals: z.string().describe('The user fitness goals.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  insights: z.string().describe('Daily insights based on user activity and food logs.'),
  suggestions: z.string().describe('Personalized suggestions adapting to user progress and preferences.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are Ria, an AI health and fitness assistant. Provide daily personalized insights and suggestions based on the user's activity and food logs, adapting to their progress and preferences.

User Health Data: {{{healthData}}}
User Fitness Goals: {{{fitnessGoals}}}
Activity Logs: {{{activityLogs}}}
Food Logs: {{{foodLogs}}}

Insights:
Suggestions: `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
