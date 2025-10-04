'use client';
import { AppShell } from '@/components/app-shell';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FoodCard } from '@/components/food-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ListFilter, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const foodItems = [
  {
    name: 'Blue Salad',
    description: 'A salad is a dish consisting of a mixture of small pieces of food, usually vegetables.',
    image: PlaceHolderImages.find((img) => img.id === 'meal-1')?.imageUrl || '',
    imageHint: 'blue salad plate',
  },
  {
    name: 'Chicken Steak',
    description: 'Grilled chicken steak served with fresh vegetables.',
    image: PlaceHolderImages.find((img) => img.id === 'meal-2')?.imageUrl || '',
    imageHint: 'chicken steak vegetables',
  },
  {
    name: 'Italian Cake',
    description: 'Delicious cake with mascarpone cheese filling.',
    image: PlaceHolderImages.find((img) => img.id === 'meal-3')?.imageUrl || '',
    imageHint: 'cake slice',
  },
];

export default function FoodMenuPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <h1 className="text-4xl font-bold font-serif">Breakfast</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListFilter className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Vertical Category Tabs */}
          <aside className="w-20 flex flex-col items-center justify-center space-y-12">
            <p className="transform -rotate-90 whitespace-nowrap text-sm text-muted-foreground">
              Seafood
            </p>
            <p className="transform -rotate-90 whitespace-nowrap text-sm text-muted-foreground">
              Noodles
            </p>
            <p className="transform -rotate-90 whitespace-nowrap text-sm font-bold text-primary">
              Bread
            </p>
          </aside>

          {/* Main Content Carousel */}
          <main className="flex-1 flex flex-col justify-center items-center overflow-hidden pb-20">
            <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              className="w-full max-w-sm"
            >
              <CarouselContent className="-ml-10">
                {foodItems.map((item, index) => (
                  <CarouselItem key={index} className="pl-10 basis-full">
                    <FoodCard {...item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </main>
        </div>

        {/* Bottom Filter Tabs */}
        <footer className="flex justify-center p-4">
          <Tabs defaultValue="foods" className="w-full max-w-xs">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200/80 rounded-full">
              <TabsTrigger value="beer" className="rounded-full">Beer</TabsTrigger>
              <TabsTrigger value="foods" className="rounded-full">Foods</TabsTrigger>
              <TabsTrigger value="wine" className="rounded-full">Wine</TabsTrigger>
            </TabsList>
          </Tabs>
        </footer>
      </div>
    </AppShell>
  );
}
