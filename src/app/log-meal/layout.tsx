'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function LogMealLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const pathname = usePathname();

    const mealTimes = [
        { value: "breakfast", label: "Breakfast" },
        { value: "morningSnack", label: "Morning Snack" },
        { value: "lunch", label: "Lunch" },
        { value: "eveningSnack", label: "Evening Snack" },
        { value: "dinner", label: "Dinner" },
        { value: "healthify-snap", label: "HealthifySnap" },
    ]

    // Determine the active tab based on the current path, default to morningSnack
    const activeTab = mealTimes.find(tab => pathname.includes(tab.value))?.value || 'morningSnack';


  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Today's Insights"
          description="Log your meals to get AI-powered insights and recommendations."
        />

        <Tabs value={activeTab} className="w-full">
          <div className="flex items-center">
          <TabsList className="grid w-full grid-cols-6">
            {mealTimes.map(meal => (
                <TabsTrigger key={meal.value} value={meal.value} asChild>
                    <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                </TabsTrigger>
            ))}
          </TabsList>
            <Button variant="ghost" className="ml-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </div>
            <TabsContent value={activeTab}>{children}</TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
