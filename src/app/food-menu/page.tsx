'use client';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FoodCard } from '@/components/food-card';
import { getIndianFoodSuggestions } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function FoodMenuPage() {
  const { data: foodSuggestions, isLoading } = useQuery({
    queryKey: ['indianFoodSuggestions'],
    queryFn: () => getIndianFoodSuggestions({ query: 'popular' }),
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Chipotto Cafe"
          description="Find your favorite meal"
        ></PageHeader>
        <div className="w-full max-w-4xl mx-auto">
          {isLoading ? (
             <div className="flex items-center justify-center h-96">
                <Skeleton className="w-full h-full" />
             </div>
          ) : (
            <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {foodSuggestions?.data?.suggestions.map((food, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <FoodCard
                      name={food.name}
                      description="A delicious and healthy meal option."
                      image={food.imageUrl}
                      imageHint="indian food"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
