'use client';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Utensils, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import type { MealTime } from '../layout';
import { startOfDay } from 'date-fns';

const mealSchema = z.object({
  mealTime: z.enum([
    'breakfast',
    'morningSnack',
    'lunch',
    'eveningSnack',
    'dinner',
  ]),
  foodName: z.string().min(2, 'Food name is required.'),
  calories: z.coerce.number().min(0, 'Calories must be a positive number.'),
  protein: z.coerce.number().min(0, 'Protein must be a positive number.'),
  carbs: z.coerce.number().min(0, 'Carbs must be a positive number.'),
  fat: z.coerce.number().min(0, 'Fat must be a positive number.'),
});

export default function ManualLogMealPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const form = useForm<z.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealTime: 'breakfast',
      foodName: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  function onSubmit(values: z.infer<typeof mealSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to log a meal.',
      });
      return;
    }
    
    const selectedDate = dateParam ? new Date(dateParam) : new Date();
    // We adjust the timestamp to be the start of the day of the selected date.
    // Firestore will handle server-side timestamping if we pass a Date object.
    const mealTimestamp = startOfDay(selectedDate);

    const newMeal = {
      mealTime: values.mealTime as MealTime,
      items: [
        {
          id: Date.now(),
          name: values.foodName,
          calories: values.calories,
          protein: values.protein,
          carbohydrates: values.carbs,
          fat: values.fat,
        },
      ],
      totalNutrition: {
        calories: values.calories,
        protein: values.protein,
        carbohydrates: values.carbs,
        fat: values.fat,
      },
      userId: user.uid,
      timestamp: Timestamp.fromDate(mealTimestamp),
    };

    const mealsCol = collection(firestore, 'users', user.uid, 'meals');
    addDocumentNonBlocking(mealsCol, newMeal);

    toast({
      title: 'Meal Logged!',
      description: `${values.foodName} has been added to your daily log.`,
    });
    router.push('/log-meal');
  }

  return (
    <>
      <PageHeader title="Log a Meal Manually">
        <Button variant="outline" asChild>
          <Link href="/log-meal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meal Logs
          </Link>
        </Button>
      </PageHeader>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Meal Details</CardTitle>
          <CardDescription>
            Enter the details of the meal you consumed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mealTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a meal time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="morningSnack">
                          Morning Snack
                        </SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="eveningSnack">
                          Evening Snack
                        </SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foodName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food / Meal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Grilled Chicken Salad"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can log a single food item here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories (kcal)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 450"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 30"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbohydrates (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 20"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 15"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full !mt-8">
                <Utensils className="mr-2 h-4 w-4" />
                Log Meal
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
