'use client';
import { HealthifySnap } from "@/components/healthify-snap";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, Timestamp } from "firebase/firestore";
import type { MealTime } from "../layout";
import { startOfDay } from "date-fns";

type FoodItem = {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
};

export default function HealthifySnapPage() {
    const router = useRouter();
    const { user } = useUser();
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');


    const handleLogMeal = (meal: {
        mealTime: MealTime;
        items: FoodItem[];
        totalNutrition: any;
        imageUrl?: string;
    }) => {
        if (!user || !meal.mealTime) return;

        const selectedDate = dateParam ? new Date(dateParam) : new Date();
        const mealTimestamp = startOfDay(selectedDate);

        const mealToLog = {
        ...meal,
        userId: user.uid,
        timestamp: Timestamp.fromDate(mealTimestamp),
        };

        const mealsCol = collection(firestore, 'users', user.uid, 'meals');
        addDocumentNonBlocking(mealsCol, mealToLog);

        router.push(`/log-meal`);
  };

    return <HealthifySnap onLogMeal={handleLogMeal} />
}