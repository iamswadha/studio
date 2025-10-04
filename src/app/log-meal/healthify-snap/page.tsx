'use client';
import { HealthifySnap } from "@/components/healthify-snap";
import { useRouter, useSearchParams } from "next/navigation";
import { logMeal } from "@/lib/actions";
import { useUser } from "@/firebase";
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
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');


    const handleLogMeal = async (meal: {
        mealTime: MealTime;
        items: FoodItem[];
        totalNutrition: any;
        imageUrl?: string;
    }) => {
        if (!user || !meal.mealTime) return;

        const selectedDate = dateParam ? new Date(dateParam) : new Date();

        await logMeal({
            userId: user.uid,
            mealTime: meal.mealTime,
            date: selectedDate.toISOString(),
            items: meal.items,
            imageUrl: meal.imageUrl,
        });

        router.push(`/dashboard`);
    };

    return <HealthifySnap onLogMeal={handleLogMeal} />
}
