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
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Utensils } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const mealSchema = z.object({
  foodName: z.string().min(2, 'Food name is required.'),
  calories: z.coerce.number().min(0, 'Calories must be a positive number.'),
  protein: z.coerce.number().min(0, 'Protein must be a positive number.'),
  carbs: z.coerce.number().min(0, 'Carbs must be a positive number.'),
  fat: z.coerce.number().min(0, 'Fat must be a positive number.'),
});

export default function ManualLogMealPage() {
  const form = useForm<z.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      foodName: '',
    },
  });

  function onSubmit(values: z.infer<typeof mealSchema>) {
    console.log(values);
    toast({
      title: 'Meal Logged!',
      description: `${values.foodName} has been added to your daily log.`,
    });
    form.reset();
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
         <PageHeader title="Log a Meal Manually">
            <Button variant="outline" asChild>
                <Link href="/log-meal">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Insights
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
                        You can search our database in a future version!
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
                          <Input type="number" placeholder="e.g., 450" {...field} />
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
                          <Input type="number" placeholder="e.g., 30" {...field} />
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
                          <Input type="number" placeholder="e.g., 20" {...field} />
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
                          <Input type="number" placeholder="e.g., 15" {...field} />
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
      </div>
    </AppShell>
  );
}
