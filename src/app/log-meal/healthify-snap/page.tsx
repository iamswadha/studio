'use client';
import { HealthifySnap } from "@/components/healthify-snap";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, serverTimestamp } from "firebase/firestore";
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


    const handleLogMeal = (meal: {
        mealTime: MealTime;
        items: FoodItem[];
        totalNutrition: any;
        imageUrl?: string;
    }) => {
        if (!user || !meal.mealTime) return;

        const mealToLog = {
        ...meal,
        userId: user.uid,
        timestamp: serverTimestamp(),
        };

        const mealsCol = collection(firestore, 'users', user.uid, 'meals');
        addDocumentNonBlocking(mealsCol, mealToLog);

        router.push(`/log-meal`);
  };

    return <HealthifySnap onLogMeal={handleLogMeal} />
}