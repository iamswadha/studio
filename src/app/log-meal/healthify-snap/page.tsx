'use client';
import { HealthifySnap } from "@/components/healthify-snap";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, Timestamp } from "firebase/firestore";
import type { MealTime } from "../layout";
import { startOfDay } from "date-fns";
import { generateMealImageAction } from "@/lib/actions";

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
    }) => {
        if (!user || !meal.mealTime) return;

        const selectedDate = dateParam ? new Date(dateParam) : new Date();
        const mealTimestamp = startOfDay(selectedDate);
        
        let generatedImageUrl: string | undefined = undefined;
        try {
            const imageResponse = await generateMealImageAction({ foodItems: meal.items.map(i => i.name) });
            if (imageResponse.success && imageResponse.data) {
                generatedImageUrl = imageResponse.data.imageUrl;
            }
        } catch (e) {
            console.error("Failed to generate meal image", e);
        }


        const mealToLog = {
            ...meal,
            userId: user.uid,
            timestamp: Timestamp.fromDate(mealTimestamp),
            imageUrl: generatedImageUrl,
        };

        const mealsCol = collection(firestore, 'users', user.uid, 'meals');
        addDocumentNonBlocking(mealsCol, mealToLog);

        router.push(`/log-meal`);
    };

    return <HealthifySnap onLogMeal={handleLogMeal} />
}
