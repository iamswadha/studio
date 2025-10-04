'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/get-personalized-recommendations.ts';
import '@/ai/flows/log-meals-with-healthify-snap.ts';
import '@/ai/flows/get-food-item-nutrition.ts';
import '@/ai/flows/get-food-suggestions.ts';
import '@/ai/flows/get-indian-food-suggestions.ts';
import '@/ai/flows/log-meal';
import '@/ai/flows/generate-meal-image';
