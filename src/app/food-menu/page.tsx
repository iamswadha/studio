'use client';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodCard } from '@/components/food-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ListFilter } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const foodItems = [
  {
    name: 'Chicken Tacos',
    description: 'Lime & Onion',
    price: '8.25',
    rating: 4.5,
    image: PlaceHolderImages.find((img) => img.id === 'meal-2')?.imageUrl || '',
    imageHint: 'chicken tacos',
  },
  {
    name: 'Chicken Steak',
    description: 'with Vegetables',
    price: '23.50',
    rating: 5,
    image: PlaceHolderImages.find((img) => img.id === 'meal-2')?.imageUrl || '',
    imageHint: 'chicken steak vegetables',
  },
  {
    name: 'Italian Cake',
    description: 'with Mascarpone',
    price: '20.00',
    rating: 4.7,
    image: PlaceHolderImages.find((img) => img.id === 'meal-3')?.imageUrl || '',
    imageHint: 'cake slice',
  },
  {
    name: 'Healthy Salad',
    description: 'with fresh greens',
    price: '12.50',
    rating: 4.8,
    image: PlaceHolderImages.find((img) => img.id === 'meal-1')?.imageUrl || '',
    imageHint: 'salad bowl',
  },
];

export default function FoodMenuPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 md:gap-8">
        <PageHeader
          title="Chipotto Cafe"
          description="delivery menu"
          className="items-start"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm">
                Sort by: <span className="font-bold">Popularity</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Popularity</DropdownMenuItem>
              <DropdownMenuItem>Rating</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PageHeader>

        <Tabs defaultValue="meat" className="w-full">
          <TabsList className="bg-transparent p-0 justify-start h-auto">
            <TabsTrigger
              value="meat"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Meat
            </TabsTrigger>
            <TabsTrigger
              value="salads"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Salads
            </TabsTrigger>
            <TabsTrigger
              value="desserts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Desserts
            </TabsTrigger>
            <TabsTrigger
              value="drinks"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Drinks
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {foodItems.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <FoodCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </AppShell>
  );
}
