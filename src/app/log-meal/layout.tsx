'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {mealTimes.map(meal => (
                <TabsTrigger key={meal.value} value={meal.value} asChild>
                    <Link href={`/log-meal/${meal.value}`}>{meal.label}</Link>
                </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab}>
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
