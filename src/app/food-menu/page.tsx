'use client';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FoodCard } from '@/components/food-card';
import { getFoodSuggestions } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Grid } from 'lucide-react';

const categories = ['Bread', 'Noodles', 'Seafood', 'Pizza', 'Pasta'];
const filters = ['Beer', 'Foods', 'Wine'];

export default function FoodMenuPage() {
  const { data: foodSuggestions, isLoading } = useQuery({
    queryKey: ['foodSuggestions'],
    queryFn: () => getFoodSuggestions({ query: 'healthy food' }),
  });

  const [activeCategory, setActiveCategory] = useState('Bread');
  const [activeFilter, setActiveFilter] = useState('Foods');

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <h1 className="font-serif text-4xl">
            Break<span className="font-bold">fast</span>
          </h1>
          <div className="flex items-center gap-4">
            <Search className="h-6 w-6 text-muted-foreground" />
            <Grid className="h-6 w-6 text-muted-foreground" />
          </div>
        </header>

        <div className="flex gap-8">
          <nav className="flex flex-col gap-8 pt-20">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'font-medium text-muted-foreground -rotate-90 origin-center whitespace-nowrap transition-colors',
                  activeCategory === category && 'text-primary'
                )}
              >
                {category}
              </button>
            ))}
          </nav>

          <main className="flex-1 flex flex-col gap-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-10">
                  {foodSuggestions?.data?.suggestions.map((food, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-3/4 pl-10"
                    >
                      <FoodCard
                        name={food.name}
                        description="A salad is a dish consisting of a mixture of small pieces of food, usually vegetables."
                        image={food.imageUrl}
                        imageHint="plated food"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* We hide the default prev/next buttons as the design does not show them */}
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            )}

            <div className="flex justify-center items-center gap-4">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? 'default' : 'ghost'}
                  className={cn(
                    'rounded-full px-6',
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground'
                  )}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}
