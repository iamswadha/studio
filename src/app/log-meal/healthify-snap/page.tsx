'use client';
import { HealthifySnap } from "@/components/healthify-snap";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, Timestamp } from "firebase/firestore";
import type { MealTime } from "../layout";

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


    const handleLogMeal = async (meal: {
        mealTime: MealTime;
        items: FoodItem[];
        totalNutrition: any;
        imageUrl?: string;
    }) => {
        if (!user || !meal.mealTime || !firestore) return;

        const selectedDate = dateParam ? new Date(dateParam) : new Date();

        const mealToLog = {
            userId: user.uid,
            timestamp: Timestamp.fromDate(selectedDate),
            mealTime: meal.mealTime,
            items: meal.items,
            totalNutrition: meal.totalNutrition,
            imageUrl: meal.imageUrl,
        };

        const mealsCol = collection(firestore, 'users', user.uid, 'meals');
        addDocumentNonBlocking(mealsCol, mealToLog);

        router.push(`/dashboard`);
    };

    return <HealthifySnap onLogMeal={handleLogMeal} />
}
