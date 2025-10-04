'use client';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShoppingBag,
  Carrot,
  Apple,
  Banana,
  Grape,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { JuiceCard } from '@/components/juice-card';
import { getJuiceSuggestions } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';

const categories = [
  { name: 'Avocado', icon: Carrot, color: 'bg-green-100 text-green-800' },
  { name: 'Mango', icon: Carrot, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Apple', icon: Apple, color: 'bg-red-100 text-red-800' },
  { name: 'Grapes', icon: Grape, color: 'bg-purple-100 text-purple-800' },
  { name: 'Banana', icon: Banana, color: 'bg-yellow-100 text-yellow-800' },
];

export default function FoodMenuPage() {
  const [activeCategory, setActiveCategory] = useState('Apple');
  
  const { data: juiceSuggestions, isLoading } = useQuery({
    queryKey: ['juiceSuggestions'],
    queryFn: () => getJuiceSuggestions({ query: 'fruit juice' }),
  });


  return (
    <div className="flex flex-col h-full bg-background rounded-3xl p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search juice..." className="pl-10 bg-input rounded-full" />
        </div>
        <Button variant="ghost" size="icon" className="ml-2">
          <ShoppingBag className="h-6 w-6" />
        </Button>
      </header>

      {/* Category Filters */}
      <div className="py-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? 'default' : 'secondary'}
                className="rounded-full flex items-center gap-2"
                onClick={() => setActiveCategory(category.name)}
              >
                <div
                  className={`p-1.5 rounded-full ${category.color}`}
                >
                  <category.icon className="h-4 w-4" />
                </div>
                <span className={activeCategory === category.name ? 'text-primary-foreground' : ''}>
                  {category.name}
                </span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Juice List */}
      <main className="flex-1 overflow-y-auto space-y-4">
        {isLoading ? (
          <p>Loading juices...</p>
        ) : (
          juiceSuggestions?.data?.suggestions.map((juice, index) => (
            <JuiceCard key={index} {...juice} />
          ))
        )}
      </main>
    </div>
  );
}
