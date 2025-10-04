import { config } from 'dotenv';
config();

import '@/ai/flows/get-personalized-recommendations.ts';
import '@/ai/flows/log-meals-with-healthify-snap.ts';
import '@/ai/flows/get-food-item-nutrition.ts';
import '@/ai/flows/get-food-suggestions.ts';
import '@/ai/flows/generate-meal-image.ts';
import '@/ai/flows/get-juice-suggestions.ts';
